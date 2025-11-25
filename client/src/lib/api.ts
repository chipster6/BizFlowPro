import type { Appointment, Client, Invoice, Transaction } from "@shared/schema";

const API_BASE = "/api";

// Appointments
export async function getAppointments(): Promise<Appointment[]> {
  const response = await fetch(`${API_BASE}/appointments`);
  if (!response.ok) throw new Error("Failed to fetch appointments");
  return response.json();
}

export async function createAppointment(data: any): Promise<Appointment> {
  const response = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create appointment");
  return response.json();
}

export async function deleteAppointment(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/appointments/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete appointment");
}

// Clients
export async function getClients(): Promise<Client[]> {
  const response = await fetch(`${API_BASE}/clients`);
  if (!response.ok) throw new Error("Failed to fetch clients");
  return response.json();
}

export async function createClient(data: any): Promise<Client> {
  const response = await fetch(`${API_BASE}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create client");
  return response.json();
}

export async function deleteClient(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/clients/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete client");
}

// Invoices
export async function getInvoices(): Promise<Invoice[]> {
  const response = await fetch(`${API_BASE}/invoices`);
  if (!response.ok) throw new Error("Failed to fetch invoices");
  return response.json();
}

export async function createInvoice(data: any): Promise<Invoice> {
  const response = await fetch(`${API_BASE}/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create invoice");
  return response.json();
}

export async function updateInvoiceStatus(id: number, status: string): Promise<Invoice> {
  const response = await fetch(`${API_BASE}/invoices/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update invoice status");
  return response.json();
}

export async function deleteInvoice(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/invoices/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete invoice");
}

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE}/transactions`);
  if (!response.ok) throw new Error("Failed to fetch transactions");
  return response.json();
}

export async function createTransaction(data: any): Promise<Transaction> {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create transaction");
  return response.json();
}

export async function deleteTransaction(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete transaction");
}
