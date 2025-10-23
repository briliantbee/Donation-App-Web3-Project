import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { Card } from "~/components/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useWallet } from "~/hooks/use-wallet";
import { useNativeBalance } from "~/hooks/use-native-balance";
import { useSubmitTransaction } from "~/hooks/use-submit-transaction";
import * as ZakatContract from "../../../../packages/CCGVX23GQ6NQWWNGAL5CC64VLTVAVHY5LLJTERU6KRGKCZOQHKZK3J5S";
import { signTransaction } from "~/config/wallet.client";
import { ArrowLeft, Heart, Users, Clock, CheckCircle } from "lucide-react";

interface Campaign {
  id: number;
  title: string;
  description: string;
  category: string;
  target_amount: bigint;
  current_amount: bigint;
  recipient: string;
  status: string;
  created_at: bigint;
}

interface Donation {
  donor: string;
  amount: bigint;
  timestamp: bigint;
}

export default function CampaignDetail() {
  const RPC_URL = "https://soroban-testnet.stellar.org:443";
  const { id } = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useWallet();
  const { balance, refetch: refetchBalance } = useNativeBalance(address);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const contract = useMemo(() => {
    if (!isConnected || address === "-") return null;
    return new ZakatContract.Client({
      ...ZakatContract.networks.testnet,
      rpcUrl: RPC_URL,
      signTransaction,
      publicKey: address,
    });
  }, [isConnected, address]);

  const { submit, isSubmitting } = useSubmitTransaction({
    rpcUrl: RPC_URL,
    networkPassphrase: ZakatContract.networks.testnet.networkPassphrase,
    onSuccess: handleOnSuccess,
    onError: (error) => {
      console.error("Donation failed", error);
      alert("Donasi gagal: " + (error as Error).message);
    },
  });

  async function handleOnSuccess() {
    await loadCampaign();
    await refetchBalance();
    setAmount("");
    alert("Donasi berhasil! Terima kasih atas kontribusi Anda 💚");
  }

  async function loadCampaign() {
    if (!contract || !id) return;

    try {
      setLoading(true);

      // Ambil detail campaign
      const campaignTx = await contract.get_campaign({ id: parseInt(id) });
      const c = campaignTx.result as any;

      setCampaign({
        id: Number(c.id),
        title: c.title,
        description: c.description,
        category: c.category,
        target_amount: BigInt(c.target_amount),
        current_amount: BigInt(c.current_amount),
        recipient: c.recipient,
        status: Object.keys(c.status)[0],
        created_at: BigInt(c.created_at),
      });

      // Ambil daftar donasi
      const donationsTx = await contract.get_donations({ id: parseInt(id) });
      const donationsData = donationsTx.result as any[];

      const formatted = donationsData.map((d: any) => ({
        donor: d.donor,
        amount: BigInt(d.amount),
        timestamp: BigInt(d.timestamp),
      }));

      setDonations(formatted);
    } catch (err) {
      console.error("Failed to load campaign:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaign();
  }, [contract, id]);

  async function handleDonate() {
    if (!isConnected || !contract || !campaign) {
      alert("Hubungkan wallet terlebih dahulu");
      return;
    }

    if (!amount.trim() || parseFloat(amount) <= 0) {
      alert("Masukkan jumlah donasi yang valid");
      return;
    }

    try {
      const xlmAmount = parseFloat(amount.trim());
      const stroopsAmount = Math.floor(xlmAmount * 10_000_000);

      const tx = await contract.donate({
        id: campaign.id,
        donor: address,
        amount: BigInt(stroopsAmount),
      }) as any;

      await submit(tx);
    } catch (e) {
      console.error("Failed to donate:", e);
      alert("Gagal membuat transaksi donasi");
    }
  }

  const formatXLM = (stroops: bigint) => (Number(stroops) / 10_000_000).toFixed(2);

  const calculateProgress = (current: bigint, target: bigint) =>
    Math.min((Number(current) / Number(target)) * 100, 100);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shortenAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading campaign...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl mb-4">Campaign tidak ditemukan</p>
        <Button onClick={() => navigate("/")}>Kembali ke Home</Button>
      </div>
    );
  }

    const progress = calculateProgress(campaign.current_amount, campaign.target_amount);
    // const status = campaign.status?.toLowerCase();
    // const isActive = status === "active";
    // const isCompleted = status === "completed";
    // const isClosed = status === "closed";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-sm text-gray-500">{campaign.category}</span>
                <h1 className="text-3xl font-bold mt-1">{campaign.title}</h1>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  campaign.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : campaign.status === "Completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {campaign.status}
              </span>
            </div>

            <p className="text-gray-600 mb-6 whitespace-pre-line">{campaign.description}</p>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-end pt-2">
                <div>
                  <p className="text-sm text-gray-500">Terkumpul</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatXLM(campaign.current_amount)} XLM
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Target</p>
                  <p className="text-xl font-semibold">
                    {formatXLM(campaign.target_amount)} XLM
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                <p className="text-2xl font-bold">{donations.length}</p>
                <p className="text-xs text-gray-500">Donatur</p>
              </div>
              <div className="text-center">
                <Heart className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                <p className="text-2xl font-bold">
                  {formatXLM(campaign.current_amount)}
                </p>
                <p className="text-xs text-gray-500">XLM Terkumpul</p>
              </div>
              <div className="text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                <p className="text-2xl font-bold">
                  {Math.floor(
                    (Date.now() - Number(campaign.created_at) * 1000) /
                      (1000 * 60 * 60 * 24)
                  )}
                </p>
                <p className="text-xs text-gray-500">Hari Berjalan</p>
              </div>
            </div>
          </Card>

          {/* List donasi */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Daftar Donatur ({donations.length})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {donations.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Belum ada donasi</p>
              ) : (
                donations.map((donation, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{shortenAddress(donation.donor)}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(donation.timestamp)}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-green-600">
                      {formatXLM(donation.amount)} XLM
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar donasi */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Berdonasi Sekarang</h2>

            {!isConnected ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-sm text-yellow-800">
                  Hubungkan wallet untuk berdonasi
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Jumlah Donasi (XLM)
                  </label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isSubmitting}
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Balance: {balance} XLM
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["1", "5", "10"].map((val) => (
                    <Button
                      key={val}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(val)}
                      disabled={isSubmitting}
                    >
                      {val} XLM
                    </Button>
                  ))}
                </div>

                <Button
                  className="w-full"
                  onClick={handleDonate}
                  disabled={isSubmitting || !amount.trim()}
                  size="lg"
                >
                  {isSubmitting ? "Memproses..." : "Donasi Sekarang"}
                </Button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Donasi Anda akan tercatat secara transparan di blockchain
                </p>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
