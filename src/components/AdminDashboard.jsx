import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('members');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const membersRes = await axios.get('http://localhost:3000/api/members');
            const transactionsRes = await axios.get('http://localhost:3000/api/transactions');
            setMembers(membersRes.data.data);
            setTransactions(transactionsRes.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Fit2Fit <span className="text-neon-green">Admin</span></h1>
                    <a href="/" className="text-gray-400 hover:text-white">Back to Site</a>
                </div>

                <div className="flex space-x-4 mb-8 border-b border-gray-700 pb-4">
                    <button
                        className={`pb-2 px-4 font-bold ${activeTab === 'members' ? 'text-neon-green border-b-2 border-neon-green' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('members')}
                    >
                        Members ({members.length})
                    </button>
                    <button
                        className={`pb-2 px-4 font-bold ${activeTab === 'transactions' ? 'text-neon-green border-b-2 border-neon-green' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('transactions')}
                    >
                        Transactions ({transactions.length})
                    </button>
                </div>

                {activeTab === 'members' ? (
                    <div className="bg-black rounded-xl overflow-hidden border border-gray-800">
                        <table className="w-full text-left">
                            <thead className="bg-gray-800 text-gray-400">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Goal</th>
                                    <th className="p-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {members.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-900">
                                        <td className="p-4 text-gray-500">#{member.id}</td>
                                        <td className="p-4 font-bold">{member.name}</td>
                                        <td className="p-4 text-gray-400">{member.email}</td>
                                        <td className="p-4 text-gray-400">{member.phone}</td>
                                        <td className="p-4">
                                            <span className="bg-gray-800 text-neon-green px-2 py-1 rounded text-xs uppercase font-bold">
                                                {member.goal}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {new Date(member.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {members.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500">No members found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-black rounded-xl overflow-hidden border border-gray-800">
                        <table className="w-full text-left">
                            <thead className="bg-gray-800 text-gray-400">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Member</th>
                                    <th className="p-4">Plan</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Card (Last 4)</th>
                                    <th className="p-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-900">
                                        <td className="p-4 text-gray-500">#{tx.id}</td>
                                        <td className="p-4 font-bold">{tx.member_name}</td>
                                        <td className="p-4 text-neon-green font-bold">{tx.plan}</td>
                                        <td className="p-4">{tx.amount}</td>
                                        <td className="p-4 text-gray-400">**** {tx.card_last4}</td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {new Date(tx.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500">No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
