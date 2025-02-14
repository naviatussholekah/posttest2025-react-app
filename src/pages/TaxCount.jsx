import useStore from "../stores/store";
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import Swal from "sweetalert2";

export default function TaxCount() {
  const { formData, setFormData, deleteFormData, dynamicFields, users } =
    useStore();
  const [formState, setFormState] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("formData")) || [];
    if(formData.length === 0){
    localData.forEach((item) => setFormData(item));
    }
  }, []);

  const formatDate = (date) => {
    return date ? date.toLocaleDateString("en-GB") : "";
  };

  const handleHitungTaxClick = () => {
    setShowForm(true);
    setIsEdit(false);
  };

  useEffect(() => {
    const requiredFields = dynamicFields
      .filter((el) => el.name !== "pajak" && el.name !== "diskon")
      .map((el) => el.name);
    const isValid = requiredFields.every(
      (field) => formState[field] !== undefined && formState[field] !== "" && formState[field] !== null 
    ) && formState.pengeluaran > 0;
    setIsFormValid(isValid);
  }, [formState, dynamicFields]);

  const handleEditData = (formData) => {
    setShowForm(true);
    setIsEdit(true);
    setFormState(formData);
  };

  const [sysDate, setSysDate] = useState(new Date());
  useEffect(() => {
    const currentDate = new Date();
    setSysDate(currentDate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDate = formatDate(new Date(formState.tanggalPembelian));

    const pengeluaran = formState.pengeluaran;
    const diskon = formState.diskon || 0;
    const hargaAwal = (pengeluaran - diskon) / 1.11;
    const pajak = pengeluaran - diskon - hargaAwal;

    const formDatawithPpn = {
      ...formState,
      pajak: pajak,
      diskon: diskon || 0,
      id: isEdit ? formState.id : Date.now(),
      tanggalPembelian: formattedDate,
    };

    if (isEdit) {
      useStore.getState().editFormData(formDatawithPpn);
    } else {
      setFormData(formDatawithPpn);
    }

    const dataLocalStorage = JSON.parse(localStorage.getItem("formData")) || [];

    if (isEdit) {
      const updatedData = dataLocalStorage.map((item) =>
        item.id === formDatawithPpn.id ? formDatawithPpn : item
      );
      localStorage.setItem("formData", JSON.stringify(updatedData));
    } else {
      dataLocalStorage.push(formDatawithPpn);
      localStorage.setItem("formData", JSON.stringify(dataLocalStorage));
    }

    setFormState({});
    setShowForm(false);

    Swal.fire({
      icon: "success",
      title: "Sukses!",
      text: "Data berhasil disimpan.",
    });
  };

  const handleCancel = () => {
    setFormState({});
    setShowForm(false);
    setIsFormValid(false);
  };

  const handleDeleteFormData = (dataId) => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      dangerMode: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const dataLocalStorage =
          JSON.parse(localStorage.getItem("formData")) || [];
        const deletedData = dataLocalStorage.filter(
          (item) => item.id !== dataId
        );
        localStorage.setItem("formData", JSON.stringify(deletedData));

        deleteFormData(dataId);
        Swal.fire({
          icon: "success",
          title: "Data telah terhapus!" 
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Hapus data dibatalkan!"
        });
      }
    });
  };

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
          keyField="id"
        >
          {dynamicFields.map((field) => (
            <Column
              key={field.name}
              field={field.name}
              header={field.label}
              sortable
              headerStyle={{ backgroundColor: "#FF9800", color: "#fff" }}
              body={(rowData) => {
                let value = rowData[field.name];
                
                if (field.type === "number" && field.name !== "jumlahProduk") {
                  value = new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(value);
                }

                return value;
              }}
            />
          ))}
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
                  onClick={() => handleDeleteFormData(rowData.id)}
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
              disabled={!isFormValid}
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
          {dynamicFields
            .filter((el) => el.name !== "pajak")
            .map((field) => (
              <div key={field.name} className="p-field p-grid">
                <label className="p-col-fixed" style={{ width: "140px" }}>
                  {field.label}:
                </label>
                <div className="p-col">
                  {field.type === "text" ? (
                    <InputText
                      name={field.name}
                      type={field.type}
                      value={formState[field.name] || ""}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          [field.name]: e.target.value,
                        })
                      }
                      placeholder={field.label}
                      required
                    />
                  ) : field.type === "number" &&
                    field.name === "jumlahProduk" ? (
                    <InputNumber
                      name={field.name}
                      min={0}
                      value={formState[field.name]}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          [field.name]: e.value,
                        })
                      }
                      placeholder={field.label}
                      required
                    />
                  ) : field.type === "number" &&
                    field.name !== "jumlahProduk" ? (
                    <InputNumber
                      name={field.name}
                      inputId="currency-indonesia"
                      value={formState[field.name] || 0}
                      mode="currency"
                      currency="IDR"
                      locale="id-ID"
                      min={0}
                      onValueChange={(e) =>
                        setFormState({
                          ...formState,
                          [field.name]: e.value === null || e.value === "" || e.value === 0 ? 0 : e.value,
                        })
                      }
                      placeholder={field.label}
                      required
                    />
                  ) : field.type === "date" ? (
                    <Calendar
                      name={field.name}
                      value={formState[field.name] || ""}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          [field.name]: e.target.value,
                        })
                      }
                      placeholder={`Pilih ${field.label}`}
                      maxDate={sysDate}
                      required
                    />
                  ) : field.type === "dropdown" ? (
                    <Dropdown
                      name={field.name}
                      value={formState[field.name]}
                      options={users}
                      onChange={(e) =>
                        setFormState({ ...formState, [field.name]: e.value })
                      }
                      placeholder={`Pilih ${field.label}`}
                      required
                    />
                  ) : null}
                </div>
              </div>
            ))}
        </div>
      </Dialog>
    </div>
  );
}
