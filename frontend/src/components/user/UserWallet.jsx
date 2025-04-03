import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, WalletIcon } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/api';

const UserWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const response = await api.get('/api/wallet/details/');
        setWallet(response.data.balance);
        setTransactions(response.data.transactions);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch wallet details');
        toast.error(err.response?.data?.error || 'Failed to fetch wallet details');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletDetails();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Wallet Balance Card */}
      <Card className="shadow-md rounded-lg w-3/6 mx-auto bg-muted dark:bg-muted/40">
        <CardHeader className="p-4 border-b flex justify-between items-center">
          <WalletIcon className="h-8 w-8"/>
          <CardTitle className="text-2xl font-semibold text-center" >Your Wallet Balance</CardTitle>
          
        </CardHeader>
        <CardContent className="p-6 flex items-center justify-center">
          {loading ? (
            <Loader2 className="animate-spin text-blue-500" />
          ) : wallet !== null ? (
            <div className="text-4xl font-extrabold ">₹ {wallet.toLocaleString()}</div>
          ) : (
            <div className="text-xl">N/A</div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History Table */}
      <Card className="shadow-md rounded-lg bg-muted dark:bg-muted/40 ">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-4">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left font-semibold">Date</TableHead>
                    <TableHead className="text-left font-semibold">Type</TableHead>
                    <TableHead className="text-left font-semibold">Amount</TableHead>
                    <TableHead className="text-left font-semibold">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="whitespace-nowrap">{new Date(tx.timestamp).toLocaleString()}</TableCell>
                        <TableCell
                          className={`whitespace-nowrap ${
                            tx.transaction_type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {tx.transaction_type}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">₹{tx.amount.toLocaleString()}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{tx.description}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserWallet;