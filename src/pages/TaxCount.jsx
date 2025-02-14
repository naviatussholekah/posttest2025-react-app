import useStore from "../stores/store";
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import Swal from 'sweetalert2';

export function TaxCount() {
  const { formData, setFormData, deleteFormData } = useStore();
  const [localFormData, setLocalFormData] = useState({
    nama: "",
    jumlahProduk: "",
    diskon: "",
    pengeluaran: "",
    tanggalPembelian: "",
  });

  const formatDate = (date) => {
    return date ? date.toLocaleDateString("en-GB") : "";
  };

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData({ ...localFormData, [name]: value });
  };

  const user = [
    { label: "User A", value: "User A" },
    { label: "User B", value: "User B" },
    { label: "User C", value: "User C" },
  ];

  const handleHitungTaxClick = () => {
    setShowForm(true);
    setIsEdit(false);
  };

  const handleEditData = (formData) => {
    setShowForm(true);
    setIsEdit(true);
    setLocalFormData(formData);
  };

  const [sysDate, setSysDate] = useState(new Date());

  useEffect(() => {
    const currentDate = new Date();
    setSysDate(currentDate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      useStore.getState().editFormData(localFormData);
    } else {
      setFormData(localFormData);
    }

    setLocalFormData({
      nama: "",
      jumlahProduk: "",
      diskon: "",
      pengeluaran: "",
      tanggalPembelian: "",
    });
    setShowForm(false);

    Swal.fire({
      icon: 'success',
      title: 'Sukses!',
      text: 'Data berhasil disimpan.',
  });
  };

  const handleCancel = () => {
    setLocalFormData({
      nama: "",
      jumlahProduk: "",
      diskon: "",
      pengeluaran: "",
      tanggalPembelian: "",
    });
    setShowForm(false);
  };

  useEffect(() => {
    console.log("Updated formData: ", formData);
  }, [formData]);

  useEffect(() => {
    console.log("Updated localFormData: ", localFormData);
  }, [localFormData]);

  return (
    <div className="p-d-flex p-jc-center p-mt-5">
      <div
        style={{ marginTop: "40px", marginLeft: "10px", marginBottom: "15px" }}
      >
        <Button
          label="Hitung Bayar PPN"
          className="p-button-warning mb-3"
          onClick={handleHitungTaxClick}
        />
      </div>
      <div>
        <DataTable
          value={formData}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          header="Detail Pengeluaran"
        >
          <Column
            field="user"
            header="User"
            sortable
            headerStyle={{ backgroundColor: "#FF9800", color: "#fff" }}
          />
          <Column
            field="nama"
            header="Nama Produk"
            sortable
            headerStyle={{ backgroundColor: "#FF9800", color: "#fff" }}
          />
          <Column
            field="jumlahProduk"
            header="Jumlah Produk"
            sortable
            headerStyle={{ backgroundColor: "#FF9800", color: "#fff" }}
          />
          <Column
            field="diskon"
            header="Diskon"
            sortable
            headerStyle={{ backgroundColor: "#FF9800", color: "#fff" }}
          />
          <Column
            field="pengeluaran"
            header="Total Bayar (setelah diskon & pajak)"
            sortable
            headerStyle={{ backgroundColor: "#FF9800", color: "#fff" }}
          />
          <Column
            body={(rowData) => {
              return formatDate(new Date(rowData.tanggalPembelian));
            }}
            header="Tanggal Pembelian"
            sortable
            headerStyle={{ backgroundColor: "#FF9800", color: "#fff" }}
          />
          <Column
            header="Total PPN yang dibayar"
            body={(rowData) => {
              const pengeluaran = rowData.pengeluaran;
              const diskon = rowData.diskon;

              const hargaAwal = (pengeluaran - diskon) / 1.11;
              const pajak = pengeluaran - diskon - hargaAwal;

              return pajak;
            }}
            sortable
            headerStyle={{ backgroundColor: "#FF9800", color: "#fff" }}
          />
          <Column
            header="Actions"
            body={(rowData) => (
              <div>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-warning mr-2"
                  onClick={() => handleEditData(rowData)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-danger"
                  onClick={() => deleteFormData(rowData.id)}
                />
              </div>
            )}
            headerStyle={{ backgroundColor: "#FF9800", color: "#fff" }}
          />
        </DataTable>
      </div>

      <Dialog
        header="Hitung Bayar PPN"
        visible={showForm}
        style={{ width: "600px" }}
        onHide={() => setShowForm(false)}
        footer={
          <div>
            <Button
              label="Submit"
              className="p-button-success"
              onClick={handleSubmit}
            />
            <Button
              label="Cancel"
              className="p-button-danger ml-2"
              onClick={handleCancel}
            />
          </div>
        }
      >
        <div className="p-grid p-fluid">
          <div className="p-field p-grid">
            <label className="p-col-fixed" style={{ width: "140px" }}>
              User:
            </label>
            <div className="p-col">
              <Dropdown
                name="user"
                value={localFormData.user}
                options={user}
                onChange={(e) =>
                  setLocalFormData({ ...localFormData, user: e.value })
                }
                required
              />
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-fixed" style={{ width: "140px" }}>
              Nama Produk:
            </label>
            <div className="p-col">
              <InputText
                name="nama"
                value={localFormData.nama}
                onChange={handleChange}
                placeholder="Nama Produk"
                required
              />
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-fixed" style={{ width: "140px" }}>
              Jumlah Produk:
            </label>
            <div className="p-col">
              <InputText
                name="jumlahProduk"
                type="number"
                value={localFormData.jumlahProduk}
                onChange={handleChange}
                placeholder="Jumlah produk yang dibeli"
                min="1"
                required
              />
            </div>
          </div>

          <div className="p-field p-grid">
            <label className="p-col-fixed" style={{ width: "140px" }}>
              Diskon Produk:
            </label>
            <div className="p-col">
              <InputText
                name="diskon"
                type="number"
                value={localFormData.diskon}
                onChange={handleChange}
                placeholder="Diskon Produk"
                min="0"
              />
            </div>
          </div>

          <div className="p-field p-grid">
            <label className="p-col-fixed" style={{ width: "140px" }}>
              Total Bayar:
            </label>
            <div className="p-col">
              <InputText
                name="pengeluaran"
                type="number"
                value={localFormData.pengeluaran}
                onChange={handleChange}
                placeholder="Total Bayar"
                min="1"
                required
              />
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-fixed" style={{ width: "140px" }}>
              Tanggal Pembelian:
            </label>
            <div className="p-col">
              <Calendar
                name="tanggalPembelian"
                value={localFormData.tanggalPembelian}
                onChange={handleChange}
                placeholder="Pilih Tanggal Pembelian"
                maxDate={sysDate}
                required
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
