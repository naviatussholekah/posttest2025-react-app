import { create } from "zustand";

const useStore = create((set) => ({
  formData: [],
  setFormData: (data) =>
    set((state) => ({
      formData: [...state.formData, { id: state.formData.length + 1, ...data }],
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
