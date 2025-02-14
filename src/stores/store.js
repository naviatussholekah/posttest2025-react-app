import { create } from "zustand";

const useStore = create((set) => ({
  formData: [],
  dynamicFields: [
    { name: "user", label: "Pilih User", type: "dropdown" },
    { name: "nama", label: "Nama Produk", type: "text" },
    { name: "jumlahProduk", label: "Jumlah Produk", type: "number" },
    { name: "diskon", label: "Diskon Produk", type: "number" },
    { name: "pengeluaran", label: "Total Bayar(setelah pajak & diskon) > 0 ", type: "number" },
    { name: "tanggalPembelian", label: "Tanggal Pembelian", type: "date" },
    { name: "pajak", label: "Total PPN yang Dikeluarkan", type: "number" },
  ],

  users: [
    { label: "User A", value: "User A" },
    { label: "User B", value: "User B" },
    { label: "User C", value: "User C" },
  ],

  setFormData: (data) =>
    set((state) => ({
      formData: [...state.formData, data],
    })),

  editFormData: (newData) =>
    set((state) => ({
      formData: state.formData.map((item) =>
        item.id === newData.id ? newData : item
      ),
    })),

  deleteFormData: (id) =>
    set((state) => ({
      formData: state.formData.filter((item) => item.id !== id),
    })),
}));

export default useStore;
