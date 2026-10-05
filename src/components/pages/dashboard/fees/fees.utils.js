export const STATUS_TABS = ["ALL", "Pending", "Partial Paid", "Paid"];

// Adapts a backend StudentFee record (see fees.service.js#serializeStudentFee)
// to the flat shape FeesTable / StudentFeeDetailModal expect.
export function toRowShape(s) {
  return {
    id: s.id, // student slug — used as admission no display + detail lookup key
    name: s.name,
    rollNo: s.rollNumber,
    class: s.class,
    guardianName: s.guardianName,
    phone: s.phone,
    email: s.email,
    address: s.address,
    totalFees: s.totalFees,
    paidAmount: s.paidAmount,
    pendingAmount: s.pendingAmount,
    status: s.status,
    breakdown: s.breakdown,
  };
}

export function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}
