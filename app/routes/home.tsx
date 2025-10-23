import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useWallet } from "~/hooks/use-wallet";
import * as ZakatContract from "../../packages/CCGVX23GQ6NQWWNGAL5CC64VLTVAVHY5LLJTERU6KRGKCZOQHKZK3J5S/dist"; // ⚠️ GANTI dengan CONTRACT_ID Anda
import { signTransaction } from "~/config/wallet.client";
import { Heart, TrendingUp, GraduationCap, Hospital, Briefcase } from "lucide-react";

export function meta() {
  return [
    { title: "Zakat & Donasi Transparant - Platform Donasi Blockchain" },
    { name: "description", content: "Platform donasi transparan berbasis blockchain Stellar" },
  ];
}

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

const categoryIcons: Record<string, any> = {
  Zakat: Heart,
  BencanaAlam: TrendingUp,
  Pendidikan: GraduationCap,
  Kesehatan: Hospital,
  UMKM: Briefcase,
};

const categoryColors: Record<string, string> = {
  Zakat: "bg-green-500",
  BencanaAlam: "bg-red-500",
  Pendidikan: "bg-blue-500",
  Kesehatan: "bg-purple-500",
  UMKM: "bg-yellow-500",
};

export default function Home() {
  const RPC_URL = "https://soroban-testnet.stellar.org:443";
  const { address, isConnected } = useWallet();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDonations, setTotalDonations] = useState(0);
  const [error, setError] = useState("");

  const contract = useMemo(() => {
    if (!isConnected || address === "-") return null;

    return new ZakatContract.Client({
      ...ZakatContract.networks.testnet,
      rpcUrl: RPC_URL,
      signTransaction,
      publicKey: address,
    });
  }, [isConnected, address]);

  useEffect(() => {
    if (!contract) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError("");

        // Get all campaigns
        const campaignsTx = await contract.get_campaigns();
        const campaignsData = campaignsTx.result as any[];

        const formatted = campaignsData.map((c: any) => ({
          id: Number(c.id),
          title: c.title,
          description: c.description,
          category: Object.keys(c.category)[0],
          target_amount: BigInt(c.target_amount),
          current_amount: BigInt(c.current_amount),
          recipient: c.recipient,
          status: Object.keys(c.status)[0],
          created_at: BigInt(c.created_at),
        }));

        setCampaigns(formatted);

        // Get total donations
        const totalTx = await contract.get_total_donations();
        setTotalDonations(Number(BigInt(totalTx.result)));

      } catch (err) {
        console.error("Failed to load campaigns:", err);
        setError("Gagal memuat data campaigns. Pastikan contract sudah di-initialize.");
      } finally {
        setLoading(false);
      }
    })();
  }, [contract]);

  const formatXLM = (stroops: bigint) => {
    return (Number(stroops) / 10_000_000).toFixed(2);
  };

  const calculateProgress = (current: bigint, target: bigint) => {
    return Math.min((Number(current) / Number(target)) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Zakat & Donasi <span className="text-blue-600">Transparant</span>
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Platform donasi transparan berbasis blockchain Stellar
        </p>
        
        {/* Total Stats */}
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-8">
          <Card className="px-8 py-4">
            <p className="text-sm text-gray-500">Total Donasi</p>
            <p className="text-3xl font-bold text-green-600">
              {formatXLM(BigInt(totalDonations))} XLM
            </p>
          </Card>
          <Card className="px-8 py-4">
            <p className="text-sm text-gray-500">Campaign Aktif</p>
            <p className="text-3xl font-bold text-blue-600">
              {campaigns.filter(c => c.status === "Active").length}
            </p>
          </Card>
          <Card className="px-8 py-4">
            <p className="text-sm text-gray-500">Total Campaign</p>
            <p className="text-3xl font-bold text-purple-600">
              {campaigns.length}
            </p>
          </Card>
        </div>

        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-yellow-800">
              💚 Hubungkan wallet Anda untuk berdonasi
            </p>
          </div>
        )}

        {isConnected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-green-800">
              ✅ Wallet terhubung! Siap untuk berdonasi
            </p>
          </div>
        )}
      </div>

      {/* Admin Button */}
      {isConnected && (
        <div className="flex justify-end mb-6">
          <Link to="/admin">
            <Button variant="outline">
              Admin Dashboard
            </Button>
          </Link>
        </div>
      )}

      {/* Campaigns Grid */}
      {campaigns.length === 0 ? (
        <div className="text-center py-20">
          <div className="mb-6">
            <Heart className="w-16 h-16 mx-auto text-gray-300" />
          </div>
          <p className="text-gray-500 text-lg mb-4">Belum ada campaign tersedia</p>
          {isConnected && (
            <Link to="/admin">
              <Button>
                Buat Campaign Pertama
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const Icon = categoryIcons[campaign.category] || Heart;
            const progress = calculateProgress(campaign.current_amount, campaign.target_amount);

            return (
              <Link key={campaign.id} to={`/campaign/${campaign.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col p-6">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`${categoryColors[campaign.category]} p-2 rounded-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {campaign.category}
                    </span>
                    <span className={`ml-auto text-xs px-2 py-1 rounded ${
                      campaign.status === "Active" ? "bg-green-100 text-green-700" :
                      campaign.status === "Completed" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {campaign.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                    {campaign.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-500">Terkumpul</p>
                      <p className="font-bold text-green-600">
                        {formatXLM(campaign.current_amount)} XLM
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Target</p>
                      <p className="font-semibold">
                        {formatXLM(campaign.target_amount)} XLM
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-16 text-center">
        <Card className="p-6 bg-blue-50 border-blue-200 max-w-3xl mx-auto text-white">
          <h3 className="font-semibold text-lg mb-2 text-white">
            🔒 Transparansi 100% dengan Blockchain
          </h3>
          <p className="text-sm text-white mb-4">
            Setiap donasi tercatat secara permanen dan transparan di Stellar blockchain.
            Data tidak bisa diubah atau dihapus oleh siapapun.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-white">✅ Transparan</p>
              <p className="text-white">Semua transaksi publik</p>
            </div>
            <div>
              <p className="font-semibold text-white">🔐 Aman</p>
              <p className="text-white">Smart contract verified</p>
            </div>
            <div>
              <p className="font-semibold text-white">⚡ Cepat</p>
              <p className="text-white">Konfirmasi dalam detik</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}