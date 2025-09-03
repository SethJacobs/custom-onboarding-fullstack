'use client';
import React, { useEffect, useState } from 'react';
import { api, User } from '../lib/api';

export default function DataPage(){
  const [users,setUsers]=useState<User[]>([]);
  useEffect(()=>{(async()=>{
    const list = await api<User[]>('/api/users');
    setUsers(list);
  })()},[]);

  return (
    <div className="card">
      <div className="text-lg font-semibold mb-4">User Data</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-white/70">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">About</th>
              <th className="text-left p-2">Street</th>
              <th className="text-left p-2">City</th>
              <th className="text-left p-2">State</th>
              <th className="text-left p-2">Zip</th>
              <th className="text-left p-2">Birthdate</th>
              <th className="text-left p-2">Step</th>
              <th className="text-left p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u=> (
              <tr key={u.id} className="border-t border-white/10">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.aboutMe?.slice(0,40)}</td>
                <td className="p-2">{u.street}</td>
                <td className="p-2">{u.city}</td>
                <td className="p-2">{u.state}</td>
                <td className="p-2">{u.zip}</td>
                <td className="p-2">{u.birthdate}</td>
                <td className="p-2">{u.currentStep}</td>
                <td className="p-2">{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
