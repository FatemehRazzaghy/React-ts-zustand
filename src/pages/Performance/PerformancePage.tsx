import { useMemo, useState } from "react";

type PerformanceItem = {
  date: string;      // YYYY-MM-DD
  score: number;     // امتیاز
  tasksDone: number; // تعداد کار انجام‌شده
};

// ---------- Helpers ----------
function toISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(d: Date, days: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

/** ماک دیتا بر اساس بازه تاریخ (خروجی ثابت برای تست) */
function createMockPerformance(from: string, to: string): PerformanceItem[] {
  const start = new Date(from);
  const end = new Date(to);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];

  const items: PerformanceItem[] = [];
  let current = start;
  let safety = 0;

  while (current <= end && safety < 365) {
    const day = current.getDate();
    items.push({
      date: toISODate(current),
      score: 60 + (day % 5) * 8,  // 60..92
      tasksDone: 2 + (day % 6),   // 2..7
    });

    current = addDays(current, 1);
    safety += 1;
  }

  return items;
}

// ---------- Component ----------
export default function PerformancePage() {
  const [personnelNo, setPersonnelNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [data, setData] = useState<PerformanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = useMemo(() => {
    if (!personnelNo.trim()) return false;
    if (!fromDate || !toDate) return false;
    return fromDate <= toDate;
  }, [personnelNo, fromDate, toDate]);

  const totals = useMemo(() => {
    const totalTasks = data.reduce((sum, x) => sum + x.tasksDone, 0);
    const avgScore =
      data.length === 0
        ? 0
        : Math.round(data.reduce((sum, x) => sum + x.score, 0) / data.length);

    return { totalTasks, avgScore };
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setError("لطفاً شماره پرسنلی و بازه تاریخ معتبر وارد کن.");
      setData([]);
      return;
    }

    setError("");
    setLoading(true);

    try {
      // شبیه‌سازی API
      await new Promise((res) => setTimeout(res, 600));

      // ماک دیتا
      const mock = createMockPerformance(fromDate, toDate);
      setData(mock);
    } catch (err: any) {
      setError(err?.message || "خطا در دریافت اطلاعات");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPersonnelNo("");
    setFromDate("");
    setToDate("");
    setData([]);
    setError("");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">گزارش عملکرد پرسنل</h2>
          <span className="text-sm text-gray-500">شماره پرسنلی + بازه تاریخ</span>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            {/* Personnel No */}
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شماره پرسنلی
              </label>
              <input
                type="text"
                placeholder="مثلاً 6021735"
                value={personnelNo}
                onChange={(e) => setPersonnelNo(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* From */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                از تاریخ
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* To */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تا تاریخ
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={!isValid || loading}
                className="
                  w-full inline-flex items-center justify-center gap-2
                  rounded-xl px-4 py-3 font-semibold text-white
                  bg-blue-600 hover:bg-blue-700 transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>در حال دریافت</span>
                  </>
                ) : (
                  <>
                    <span>📊</span>
                    <span>نمایش</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="
                  w-full rounded-xl px-4 py-3 font-semibold
                  border border-gray-300 bg-white hover:bg-gray-100 transition
                  focus:outline-none focus:ring-2 focus:ring-gray-300
                "
              >
                پاک‌کردن
              </button>
            </div>
          </form>

          {/* Info / Error */}
          {data.length === 0 && !loading && !error && (
            <div className="mt-4 text-sm text-gray-600">
              شماره پرسنلی و بازه تاریخ را وارد کن و روی «نمایش» بزن.
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {data.length > 0 && (
          <div className="mt-6">
            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">تعداد روزها</div>
                <div className="text-xl font-bold">{data.length}</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">جمع کارهای انجام‌شده</div>
                <div className="text-xl font-bold">{totals.totalTasks}</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">میانگین امتیاز</div>
                <div className="text-xl font-bold">{totals.avgScore}</div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full text-right">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 border-b">تاریخ</th>
                    <th className="p-3 border-b">امتیاز</th>
                    <th className="p-3 border-b">تعداد کار</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.date} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{item.date}</td>
                      <td className="p-3 border-b text-center">{item.score}</td>
                      <td className="p-3 border-b text-center">{item.tasksDone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer note */}
            <div className="text-xs text-gray-500 mt-3">
              (داده‌ها فعلاً ماک هستند. بعداً می‌تونیم به API واقعی وصلش کنیم.)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}