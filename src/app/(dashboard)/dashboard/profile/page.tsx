"use client";
import { motion } from "framer-motion";
import { User, Mail, Shield, Bell, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Profile Settings</h1>
        <p className="text-zinc-500">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Full Name</label>
                  <Input placeholder="John Doe" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                  <Input placeholder="john@example.com" disabled />
                  <p className="text-[10px] text-zinc-400">Email cannot be changed manually.</p>
               </div>
            </div>
            <Button className="bg-zinc-900">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <div>
                   <p className="text-sm font-bold text-zinc-900">Two-Factor Authentication</p>
                   <p className="text-xs text-zinc-500">Add an extra layer of security to your account.</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
             </div>
          </CardContent>
        </Card>

        <Card className="border-red-100">
           <CardHeader>
              <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
           </CardHeader>
           <CardContent>
              <p className="text-sm text-zinc-500 mb-4">
                 Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100">
                 Delete Account
              </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
