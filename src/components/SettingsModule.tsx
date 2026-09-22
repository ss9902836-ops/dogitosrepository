import React, { useState } from 'react';
import { 
  Settings, 
  QrCode, 
  Store, 
  Phone, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { BusinessConfig } from '../types';

interface SettingsModuleProps {
  config: BusinessConfig;
  setConfig: React.Dispatch<React.SetStateAction<BusinessConfig>>;
  onResetData: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  config,
  setConfig,
  onResetData,
}) => {
  const [formData, setFormData] = useState<BusinessConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Configuración del Negocio & QR de Pagos</h2>
          <p className="text-xs text-zinc-400 mt-1">Personaliza los datos impresos en recibos, número de Nequi y códigos QR digitales.</p>
        </div>
        {savedSuccess && (
          <span className="flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-2xl text-xs font-bold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>¡Guardado con éxito!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Info Card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Información del Establecimiento</h3>
              <p className="text-xs text-zinc-400">Datos corporativos para comprobantes y facturación.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Nombre del Negocio</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Eslogan</label>
              <input
                type="text"
                value={formData.slogan}
                onChange={e => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Teléfono / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">NIT / Cédula Fiscal</label>
              <input
                type="text"
                value={formData.taxId}
                onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Dirección del Local</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Payments & QR Card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Pagos Digitales & Código QR Nequi</h3>
              <p className="text-xs text-zinc-400">Configuración para transferencias y códigos QR en facturas.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Número de Nequi</label>
              <input
                type="text"
                value={formData.nequiNumber}
                onChange={e => setFormData({ ...formData, nequiNumber: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Datos Bancarios Adicionales</label>
              <input
                type="text"
                value={formData.bankDetails}
                onChange={e => setFormData({ ...formData, bankDetails: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">URL o Enlace del QR de Pagos</label>
              <input
                type="url"
                value={formData.qrText}
                onChange={e => setFormData({ ...formData, qrText: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all"
          >
            Guardar Configuración
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Data */}
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-red-500/30 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0 mt-1">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Zona de Restauración</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Restaura todos los datos iniciales de Dogitos Fast Food (inventario, recetas, órdenes y movimientos de prueba).
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('¿Estás seguro de reiniciar todos los datos a los valores de fábrica? Se perderán los cambios locales.')) {
              onResetData();
            }
          }}
          className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 text-red-400 font-bold px-5 py-3 rounded-2xl hover:bg-red-500/20 transition-all text-sm whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restaurar Datos Iniciales</span>
        </button>
      </div>
    </div>
  );
};
