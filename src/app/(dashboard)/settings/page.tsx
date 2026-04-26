"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Shield,
  Activity,
  Filter,
  User,
  ArrowRightLeft,
  Eye,
  EyeOff,
  Plus,
  ShoppingCart,
  MapPin,
  FileText,
  ChevronDown,
  UserCog,
  Palette,
  Check,
  X,
  Package,
  Percent,
  DollarSign,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useActivityLog, type ActivityEntry } from "@/lib/hooks/use-activity-log";
import { useCustomRoles } from "@/lib/hooks/use-custom-roles";
import { useProducts } from "@/lib/hooks/use-products";

const actionConfig: Record<string, { icon: typeof Activity; color: string; label: string }> = {
  granted_access: { icon: Eye, color: "text-emerald-500", label: "Granted Access" },
  revoked_access: { icon: EyeOff, color: "text-destructive", label: "Revoked Access" },
  created_user: { icon: Plus, color: "text-primary", label: "Created User" },
  created_lead: { icon: FileText, color: "text-foreground", label: "Created Lead" },
  created_sale: { icon: ShoppingCart, color: "text-accent", label: "Recorded Sale" },
  created_visit: { icon: MapPin, color: "text-primary", label: "Logged Visit" },
};

const filterOptions = [
  { value: "", label: "All Activity" },
  { value: "permission", label: "Permissions" },
  { value: "lead", label: "Leads" },
  { value: "sale", label: "Sales" },
  { value: "visit", label: "Visits" },
  { value: "user", label: "Users" },
];

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ActivityItem({ entry }: { entry: ActivityEntry }) {
  const config = actionConfig[entry.action] || {
    icon: Activity,
    color: "text-[#71717a]",
    label: entry.action.replace(/_/g, " "),
  };
  const Icon = config.icon;
  const meta = entry.metadata as Record<string, string>;

  let description = config.label;
  if (entry.action === "granted_access" || entry.action === "revoked_access") {
    description = `${config.label} to ${meta.page || "a page"}`;
  }

  return (
    <div className="flex gap-4 group">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-lg glass-panel shadow-sm border-primary/10 ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="w-px flex-1 bg-border/50 mt-2 group-last:hidden" />
      </div>

      {/* Content */}
      <div className="pb-8 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
              {description}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              by <span className="text-foreground font-medium">{entry.user_name}</span>
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap shrink-0">
            {formatTimestamp(entry.created_at)}
          </span>
        </div>

        {/* Metadata chips */}
        {Object.keys(meta).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {Object.entries(meta)
              .filter(([key]) => key !== "old_value" && key !== "new_value")
              .slice(0, 3)
              .map(([key, value]) => (
                <span
                  key={key}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/20 font-bold tracking-wider uppercase shadow-sm"
                >
                  {key}: {String(value).substring(0, 20)}
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RoleManager() {
  const { roles, addRole, deleteRole } = useCustomRoles();
  const [isCreating, setIsCreating] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", colorId: "purple" });
  const [newPerms, setNewPerms] = useState<Record<string, boolean>>({
    dashboard: true, visits: false, sales: false, leads: false, employees: false, reports: false, users: false, settings: false
  });

  const colors = [
    { id: "purple", value: "bg-primary/10 text-primary border-primary/20" },
    { id: "cyan", value: "bg-accent/10 text-accent border-accent/20" },
    { id: "pink", value: "bg-destructive/10 text-destructive border-destructive/20" },
    { id: "green", value: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  ];

  const permKeys = ["dashboard", "visits", "sales", "leads", "employees", "reports", "users", "settings"];

  const handleSave = () => {
    if (!newRole.name) return;
    addRole({
      id: newRole.name.toLowerCase().replace(/\s+/g, '-'),
      name: newRole.name,
      color: colors.find(c => c.id === newRole.colorId)?.value || colors[0].value,
      permissions: newPerms
    });
    setIsCreating(false);
    setNewRole({ name: "", colorId: "purple" });
    setNewPerms({ dashboard: true, visits: false, sales: false, leads: false, employees: false, reports: false, users: false, settings: false });
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
          <div className="p-2 rounded-lg glass-panel shadow-sm">
            <UserCog className="w-5 h-5 text-primary" />
          </div>
          Role & Permissions Configurator
        </h2>
        <button onClick={() => setIsCreating(!isCreating)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/30 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {roles.map(role => (
          <div key={role.id} className="glass-panel rounded-xl p-5 hover:bg-primary/5 transition-colors group relative shadow-sm hover:shadow-md">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border shadow-sm ${role.color}`}>
                {role.name}
              </span>
              {role.id !== 'admin' && role.id !== 'manager' && (
                <button onClick={() => deleteRole(role.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-background rounded-md hover:bg-destructive/10 border border-border shadow-sm">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 relative z-10">
              {Object.entries(role.permissions).filter(([_, v]) => v).map(([k]) => (
                <span key={k} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border capitalize font-medium shadow-sm">
                  {k}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isCreating && (
        <motion.div initial={{ opacity: 0, height: 0, scale: 0.98 }} animate={{ opacity: 1, height: "auto", scale: 1 }} className="glass-panel rounded-xl p-6 overflow-hidden relative shadow-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mt-20 -mr-20" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Custom Role Name</label>
                <input value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} type="text" placeholder="e.g. Sales Coordinator" className="w-full glass-panel rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><Palette className="w-3.5 h-3.5" /> Badge Appearance</label>
                <div className="flex gap-3">
                  {colors.map(c => (
                    <button key={c.id} onClick={() => setNewRole({...newRole, colorId: c.id})} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${c.value.split(' ')[0].replace('/10', '/30')} ${newRole.colorId === c.id ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}>
                      {newRole.colorId === c.id && <Check className="w-5 h-5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Resource Access (What they can see)</label>
              <div className="grid grid-cols-2 gap-3 glass-panel p-4 rounded-xl border-primary/10">
                {permKeys.map(k => (
                  <label key={k} className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newPerms[k] ? 'bg-primary border-primary' : 'bg-background border-border group-hover:border-primary/50'}`}>
                      {newPerms[k] && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                    <span className={`text-sm capitalize transition-colors ${newPerms[k] ? 'text-foreground font-bold' : 'text-muted-foreground group-hover:text-foreground'}`}>{k}</span>
                    <input type="checkbox" className="hidden" checked={newPerms[k]} onChange={(e) => setNewPerms({...newPerms, [k]: e.target.checked})} disabled={k === 'dashboard'} />
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 relative z-10 border-t border-border/50 pt-5">
            <button onClick={() => setIsCreating(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border">Cancel</button>
            <button onClick={handleSave} className="bg-primary text-primary-foreground px-8 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2">
              Generate Role
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ProductManager() {
  const { products, addProduct, deleteProduct, toggleProduct } = useProducts();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", discount: "0" });

  const handleAdd = () => {
    if (!form.name || !form.price) return;
    addProduct({
      name: form.name,
      price: parseFloat(form.price),
      discount: parseFloat(form.discount) || 0,
      isActive: true,
    });
    setForm({ name: "", price: "", discount: "0" });
    setIsAdding(false);
  };

  const inputClasses = "w-full glass-panel rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground";

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
          <div className="p-2 rounded-lg glass-panel shadow-sm">
            <Package className="w-5 h-5 text-primary" />
          </div>
          Product & Pricing Manager
        </h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/30 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {isAdding && (
        <motion.div initial={{ opacity: 0, height: 0, scale: 0.98 }} animate={{ opacity: 1, height: "auto", scale: 1 }} className="glass-panel rounded-xl p-6 overflow-hidden mb-4 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Product Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" placeholder="e.g. Fiber Optic 100Mbps" className={inputClasses} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Base Price *</label>
              <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} type="number" step="0.01" placeholder="0.00" className={inputClasses} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Percent className="w-3.5 h-3.5" /> Discount %</label>
              <input value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} type="number" min="0" max="100" placeholder="0" className={inputClasses} />
            </div>
          </div>
          {/* Price Preview */}
          {form.price && (
            <div className="mt-4 p-3 rounded-lg glass-panel flex items-center justify-between border-primary/20 bg-primary/5 shadow-sm">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Final Price after discount:</span>
              <span className="text-lg font-bold font-mono text-foreground drop-shadow-sm">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                  parseFloat(form.price) * (1 - (parseFloat(form.discount) || 0) / 100)
                )}
                {parseFloat(form.discount) > 0 && (
                  <span className="text-xs text-muted-foreground line-through ml-2">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(parseFloat(form.price))}
                  </span>
                )}
              </span>
            </div>
          )}
          <div className="mt-4 flex justify-end gap-3 border-t border-border/50 pt-4">
            <button onClick={() => setIsAdding(false)} className="px-5 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleAdd} disabled={!form.name || !form.price} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Save Product
            </button>
          </div>
        </motion.div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => {
          const finalPrice = product.price * (1 - product.discount / 100);
          return (
            <div key={product.id} className={`glass-panel rounded-xl p-5 group relative transition-all hover:shadow-md ${!product.isActive ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-heading font-bold text-foreground text-sm group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-mono font-bold text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(finalPrice)}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span className="text-xs text-muted-foreground line-through">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}
                        </span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                          -{product.discount}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${product.isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-muted text-muted-foreground border border-border'}`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                <button onClick={() => toggleProduct(product.id)} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted shadow-sm border border-transparent hover:border-border">
                  {product.isActive ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4" />}
                  {product.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => deleteProduct(product.id)} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10 ml-auto border border-transparent hover:border-destructive/20 shadow-sm">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {products.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-xl shadow-sm">
          <Package className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-sm font-bold text-muted-foreground">No products yet. Click "Add Product" to get started.</p>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [entityFilter, setEntityFilter] = useState("");
  const { entries, loading, hasMore, loadMore } = useActivityLog({
    entityType: entityFilter || undefined,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10"
    >
      {/* Liquid Light Orbs */}
      <div
        className="fixed top-[10%] right-[5%] w-[40vw] h-[40vw] rounded-full pointer-events-none z-0 blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(12, 12, 29, 0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg font-medium">
              System configuration and activity audit log for the MarketPro platform.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-2.5 rounded-lg glass-panel shadow-sm border-primary/20 bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground font-mono">{entries.length}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Events</p>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-2.5 rounded-lg glass-panel shadow-sm border-accent/20 bg-accent/10">
              <ArrowRightLeft className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground font-mono">
                {entries.filter((e) => e.entity_type === "permission").length}
              </p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Permission Changes</p>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-2.5 rounded-lg glass-panel shadow-sm border-emerald-500/20 bg-emerald-500/10">
              <User className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground font-mono">
                {new Set(entries.map((e) => e.user_id)).size}
              </p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Users</p>
            </div>
          </div>
        </div>

        <RoleManager />
        <ProductManager />

        {/* Audit Log Panel */}
        <div className="glass-panel rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {/* Filter Header */}
          <div className="p-5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-lg font-bold text-foreground">
                Activity Audit Log
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={entityFilter}
                  onChange={(e) => setEntityFilter(e.target.value)}
                  className="bg-background border border-border rounded-lg pl-9 pr-8 py-2 text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors font-medium shadow-sm"
                >
                  {filterOptions.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-sm font-bold text-muted-foreground">Loading activity...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="p-4 rounded-full bg-muted mb-4 shadow-inner">
                  <Activity className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-foreground font-bold">
                  No activity yet
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Actions will appear here as they happen
                </p>
              </div>
            ) : (
              <>
                {entries.map((entry) => (
                  <ActivityItem key={entry.id} entry={entry} />
                ))}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={loadMore}
                      className="px-6 py-2.5 rounded-lg text-sm font-bold text-primary border border-primary/20 hover:bg-primary/5 transition-colors shadow-sm"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
