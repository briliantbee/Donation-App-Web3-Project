import { useState, useEffect, useMemo } from "react";
import { Card } from "~/components/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useWallet } from "~/hooks/use-wallet";
import { useSubmitTransaction } from "~/hooks/use-submit-transaction";
import * as ZakatContract from "../../packages/CCGVX23GQ6NQWWNGAL5CC64VLTVAVHY5LLJTERU6KRGKCZOQHKZK3J5S";
import { signTransaction } from "~/config/wallet.client";
import { Plus, X, CheckCircle, XCircle } from "lucide-react";

export function meta() {
  return [
    { title: "Admin Dashboard - Zakat & Donasi" },
    { name: "description", content: "Manage campaigns" },
  ];
}

// 🔑 HARDCODED ADMIN ADDRESS
const ADMIN_ADDRESS = "GCHZKHW5ISEQ4BPSUDUIUFKAL4XSRDGZJMN7RPOODFXKX6QOWWH3Q5VQ";

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

const categories = [
  { value: "Zakat", label: "Zakat" },
  { value: "Pendidikan", label: "Pendidikan" },
  { value: "Kesehatan", label: "Kesehatan" },
  { value: "BencanaAlam", label: "Bencana Alam" },
  { value: "UMKM", label: "UMKM" },
];

export default function AdminDashboard() {
  const RPC_URL = "https://soroban-testnet.stellar.org:443";
  const { address, isConnected } = useWallet();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Zakat");
  const [targetAmount, setTargetAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  // Check if current user is admin (simple comparison)
  const isAdmin = isConnected && address === ADMIN_ADDRESS;

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
      console.error("Transaction failed", error);
      alert("Transaksi gagal: " + (error as Error).message);
    },
  });

  async function handleOnSuccess() {
    await loadCampaigns();
    resetForm();
    setShowCreateForm(false);
    alert("Campaign berhasil dibuat! 🎉");
  }

  async function loadCampaigns() {
    if (!contract) return;

    try {
      setLoading(true);

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

    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, [contract]);

  // Set recipient to current address when wallet connects
  useEffect(() => {
    if (isConnected && address && address !== "-") {
      setRecipient(address);
    }
  }, [isConnected, address]);

  async function handleCreateCampaign() {
  if (!isConnected || !contract) {
    alert("Hubungkan wallet terlebih dahulu");
    return;
  }

  if (!title.trim() || !description.trim() || !targetAmount.trim()) {
    alert("Semua field wajib diisi");
    return;
  }

  const targetXLM = parseFloat(targetAmount);
  if (isNaN(targetXLM) || targetXLM <= 0) {
    alert("Target amount harus angka positif");
    return;
  }

  try {
    const stroopsAmount = Math.floor(targetXLM * 10_000_000);

    const tx = await contract.create_campaign({
    title,
    description,
    category,
    target_amount: BigInt(stroopsAmount),
    recipient: address,
    });


    await submit(tx);
  } catch (e) {
    console.error("Failed to create campaign:", e);
    alert("Gagal membuat campaign: " + (e as Error).message);
  }
}


  async function handleCloseCampaign(campaignId: number) {
    if (!contract || !isAdmin) return;

    if (!confirm("Yakin ingin menutup campaign ini?")) return;

    try {
      // use the parameter names the contract type expects
      const tx = await contract.close_campaign({
        id: campaignId,
        caller: address,
      }) as any;

      await submit(tx);
      alert("Campaign ditutup!");
      await loadCampaigns();
    } catch (e) {
      console.error("Failed to close campaign:", e);
      alert("Gagal menutup campaign");
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("Zakat");
    setTargetAmount("");
    setRecipient(address);
  }

  const formatXLM = (stroops: bigint) => {
    return (Number(stroops) / 10_000_000).toFixed(2);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="p-8 text-center max-w-md">
          <p className="text-xl mb-4">Hubungkan wallet untuk akses admin dashboard</p>
          <p className="text-sm text-gray-500">
            Gunakan wallet address yang terdaftar sebagai admin
          </p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Anda tidak memiliki akses admin</p>
          
          <div className="bg-gray-100 p-3 rounded-md text-left mb-4">
            <p className="text-xs text-gray-500 mb-1">Your Address:</p>
            <p className="text-xs font-mono break-all">{address}</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md text-left">
            <p className="text-xs text-blue-600 mb-1">Required Admin Address:</p>
            <p className="text-xs font-mono break-all text-blue-800">{ADMIN_ADDRESS}</p>
          </div>

          <Button
            onClick={() => window.location.href = "/"}
            className="mt-6"
          >
            Kembali ke Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Kelola campaign donasi</p>
          <p className="text-xs text-green-600 mt-1">✅ Logged in as Admin</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2"
        >
          {showCreateForm ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Buat Campaign Baru
            </>
          )}
        </Button>
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Buat Campaign Baru</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Judul Campaign *
              </label>
              <Input
                type="text"
                placeholder="Bantu Korban Banjir Jakarta"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Kategori *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Target Amount (XLM) *
              </label>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="10.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Recipient Address *
              </label>
              <Input
                type="text"
                placeholder="GXXX..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setRecipient(address)}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                Gunakan address saya
              </button>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Deskripsi *
              </label>
              <textarea
                placeholder="Jelaskan detail campaign..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleCreateCampaign}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Membuat..." : "Buat Campaign"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setShowCreateForm(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Campaigns</p>
          <p className="text-2xl font-bold">{campaigns.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {campaigns.filter(c => c.status === "Active").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-blue-600">
            {campaigns.filter(c => c.status === "Completed").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Closed</p>
          <p className="text-2xl font-bold text-gray-600">
            {campaigns.filter(c => c.status === "Closed").length}
          </p>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 text-white">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada campaign
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => {
                  const progress = Math.min(
                    (Number(campaign.current_amount) / Number(campaign.target_amount)) * 100,
                    100
                  );

                  return (
                    <tr key={campaign.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{campaign.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {campaign.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">{campaign.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full max-w-xs">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{formatXLM(campaign.current_amount)} XLM</span>
                            <span>{progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Target: {formatXLM(campaign.target_amount)} XLM
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          campaign.status === "Active" ? "bg-green-100 text-green-800" :
                          campaign.status === "Completed" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.location.href = `/campaign/${campaign.id}`}
                          >
                            View
                          </Button>
                          {campaign.status === "Active" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCloseCampaign(campaign.id)}
                              disabled={isSubmitting}
                              className="text-red-600 hover:text-red-700"
                            >
                              Close
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold mb-2 text-blue-900">💡 Tips Admin</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Campaign yang sudah Complete bisa di-withdraw oleh recipient</li>
          <li>• Campaign yang di-Close tidak bisa menerima donasi lagi</li>
          <li>• Pastikan recipient address benar sebelum membuat campaign</li>
          <li>• Target amount dalam satuan XLM (contoh: 10 = 10 XLM)</li>
        </ul>
      </Card>
    </div>
  );
}