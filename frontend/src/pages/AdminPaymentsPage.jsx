import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [filters, setFilters] = useState({
    status: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "payment_date",
    direction: "desc",
  });

  const statusOptions = [
    { value: "SUCCESS", label: "Başarılı" },
    { value: "PENDING", label: "Beklemede" },
    { value: "FAILED", label: "Başarısız" },
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [payments, searchTerm, dateRange, filters, sortConfig]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(response.data);
      setFilteredPayments(response.data);
    } catch (error) {
      console.error("Ödemeler alınamadı:", error);
      setError("Ödemeler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...payments];

    // Arama filtresi
    if (searchTerm) {
      result = result.filter(
        (payment) =>
          payment.customer_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.reservation_id?.toString().includes(searchTerm)
      );
    }

    // Tarih aralığı filtresi
    if (dateRange.startDate && dateRange.endDate) {
      result = result.filter((payment) => {
        const paymentDate = new Date(payment.payment_date);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return paymentDate >= startDate && paymentDate <= endDate;
      });
    }

    // Durum filtresi
    if (filters.status) {
      result = result.filter((payment) => payment.status === filters.status);
    }

    // Sıralama
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Tarih alanları için özel karşılaştırma
        if (sortConfig.key === "payment_date" || sortConfig.key === "check_in" || sortConfig.key === "check_out") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredPayments(result);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-payments-page">
        <div className="admin-payments-container">
          <h2 className="admin-payments-title">Ödeme Kayıtları</h2>
          <div className="loading-message">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-payments-page">
        <div className="admin-payments-container">
          <h2 className="admin-payments-title">Ödeme Kayıtları</h2>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-payments-page">
      <div className="admin-payments-container">
        <h2 className="admin-payments-title">Ödeme Kayıtları</h2>

        {/* Arama ve Filtreleme */}
        <div className="admin-payments-filters">
          <div className="admin-payments-search">
            <input
              type="text"
              placeholder="Müşteri adı, e-posta veya rezervasyon ID ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Tüm Durumlar</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="admin-payments-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("customer_full_name")}>
                Müşteri Adı {sortConfig.key === "customer_full_name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("customer_email")}>
                E-posta {sortConfig.key === "customer_email" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("reservation_id")}>
                Rezervasyon ID {sortConfig.key === "reservation_id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("check_in")}>
                Giriş Tarihi {sortConfig.key === "check_in" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("check_out")}>
                Çıkış Tarihi {sortConfig.key === "check_out" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("amount")}>
                Tutar {sortConfig.key === "amount" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("payment_date")}>
                Ödeme Tarihi {sortConfig.key === "payment_date" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("status")}>
                Durum {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data-message">
                  Ödeme kaydı bulunamadı
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.customer_full_name || payment.customer_name}</td>
                  <td>{payment.customer_email}</td>
                  <td>{payment.reservation_id}</td>
                  <td>{formatDate(payment.check_in)}</td>
                  <td>{formatDate(payment.check_out)}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>{formatDate(payment.payment_date)}</td>
                  <td>
                    <span className={`admin-payment-status ${payment.status?.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
