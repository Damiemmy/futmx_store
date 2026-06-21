import { useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../api/endpoints";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../api/client";

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    email: user?.email ?? "",
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
  });
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authApi.updateProfile(form);
      setUser(data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if(passwords.new_password!=passwords.confirm_password){
      toast.error("Password mismatch");
    }else{
      try {
        await authApi.changePassword(
          passwords.old_password,
          passwords.new_password
        );
        toast.success("Password changed");
        setPasswords({ old_password: "", new_password: "",confirm_password:""});
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl text-navy">Profile</h1>
      <p className="mt-2 text-navy/60">Manage your account settings</p>

      <form onSubmit={saveProfile} className="card mt-8 space-y-4 p-6">
        <h3 className="font-medium">Personal information</h3>
        <div>
          <label className="text-sm text-navy/70">Username</label>
          <input className="input-field mt-1 bg-navy/5" value={user?.username} disabled />
        </div>
        <div>
          <label className="text-sm text-navy/70">Email</label>
          <input
            type="email"
            className="input-field mt-1"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-navy/70">First name</label>
            <input
              className="input-field mt-1"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-navy/70">Last name</label>
            <input
              className="input-field mt-1"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          Save changes
        </button>
      </form>

      <form onSubmit={changePassword} className="card mt-6 space-y-4 p-6">
        <h3 className="font-medium">Change password</h3>
        <div>
          <label className="text-sm text-navy/70">Current password</label>
          <input
            type="password"
            className="input-field mt-1"
            value={passwords.old_password}
            onChange={(e) =>
              setPasswords({ ...passwords, old_password: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm text-navy/70">New password</label>
          <input
            type="password"
            className="input-field mt-1"
            value={passwords.new_password}
            onChange={(e) =>
              setPasswords({ ...passwords, new_password: e.target.value })
            }
            minLength={8}
          />
        </div>
        <div>
          <label className="text-sm text-navy/70">Confirm password</label>
          <input
            type="password"
            className="input-field mt-1"
            value={passwords.confirm_password}
            onChange={(e) =>
              setPasswords({ ...passwords, confirm_password: e.target.value })
            }
            minLength={8}
          />
        </div>
        <button type="submit" className="btn-secondary">
          Update password
        </button>
      </form>
    </div>
  );
}
