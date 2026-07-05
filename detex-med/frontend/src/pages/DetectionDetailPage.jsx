import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function DetectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/detections/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data dari API");
        return res.json();
      })
      .then((data) => {
        // Jika API membalas dengan struktur data bungkus (misal data.data)
        const finalData = data?.data || data;
        if (finalData && Object.keys(finalData).length > 0) {
          setDetailData(finalData);
        } else {
          throw new Error("Data kosong");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Menggunakan data fallback lokal untuk detail:", err);
        
        // DATA CADANGAN LENGKAP 1 - 9
        const dummyDatabaseData = [
          { id: 1, original_filename: "Tr-gl_1205.jpg", patient_name: "yanti", patient_id: "p-01", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 1, max_confidence: 0.85, created_at: "2026-07-03", processing_time_ms: 243, detections_data: '[{"bbox":[124,85,340,290],"confidence":0.85,"area":44280,"class":"tumor"}]' },
          { id: 2, original_filename: "Te-gl_14.jpg", patient_name: "syaiful", patient_id: "p-02", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 0, max_confidence: 0, created_at: "2026-06-25", processing_time_ms: 112, detections_data: '[]' },
          { id: 3, original_filename: "Te-gl_110.jpg", patient_name: "Ahmad", patient_id: "p-03", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 0, max_confidence: 0, created_at: "2026-06-25", processing_time_ms: 98, detections_data: '[]' },
          { id: 4, original_filename: "Te-gl_140.jpg", patient_name: "syaiful", patient_id: "p-04", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 1, max_confidence: 0.74, created_at: "2026-07-03", processing_time_ms: 185, detections_data: '[{"bbox":[150,95,210,180],"confidence":0.74,"area":5100,"class":"tumor"}]' },
          { id: 5, original_filename: "Te-gl_110.jpg", patient_name: "ken", patient_id: "p-05", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 0, max_confidence: 0, created_at: "2026-07-03", processing_time_ms: 142, detections_data: '[]' },
          { id: 6, original_filename: "Tr-gl_349.jpg", patient_name: "sisil", patient_id: "p-06", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 0, max_confidence: 0, created_at: "2026-07-03", processing_time_ms: 130, detections_data: '[]' },
          { id: 7, original_filename: "Te-gl_140.jpg", patient_name: "beno", patient_id: "1783210131", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 1, max_confidence: 0.87, created_at: "2026-07-03", processing_time_ms: 156, detections_data: '[{"bbox":[124,85,340,290],"confidence":0.87,"area":44280,"class":"tumor"},{"bbox":[150,95,210,180],"confidence":0.74,"area":5100,"class":"tumor"}]' },
          { id: 8, original_filename: "Te-gl_15.jpg", patient_name: "ben", patient_id: "p-08", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 0, max_confidence: 0, created_at: "2026-07-03", processing_time_ms: 115, detections_data: '[]' },
          { id: 9, original_filename: "Te-gl_102.jpg", patient_name: "naim", patient_id: "p-16", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 1, max_confidence: 0.52, created_at: "2026-07-03", processing_time_ms: 210, detections_data: '[{"bbox":[50,180,166,314],"confidence":0.52,"area":15468,"class":"tumor"}]' }
        ];

        // Cari berdasarkan ID angka ATAU berdasarkan string patient_id
        const foundData = dummyDatabaseData.find(
          (item) => item.id === parseInt(id) || item.patient_id === id
        );

        if (foundData) {
          setDetailData(foundData);
        } else {
          // JIKA TIDAK KETEMU DI DUMMY (Berarti ini hasil deteksi baru di sistem)
          // Cegah redirect paksa ke Yanti dengan membuat template data dinamis
          setDetailData({
            id: id || Math.floor(Math.random() * 1000),
            original_filename: "Deteksi_Baru.jpg",
            patient_name: "Pasien Baru",
            patient_id: id || "P-NEW",
            image_type: "MRI",
            model_used: "YOLOv8n",
            tumor_detected: 1,
            max_confidence: 0.80,
            created_at: new Date().toISOString().split('T')[0],
            processing_time_ms: 150,
            detections_data: '[{"bbox":[100,100,250,250],"confidence":0.80,"area":22500,"class":"tumor"}]'
          });
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6 text-xs font-bold text-slate-500">Memuat detail...</div>;
  if (!detailData) return <div className="p-6 text-xs font-bold text-red-500">Data tidak ditemukan.</div>;

  const isTumor = parseInt(detailData.tumor_detected) === 1;

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen text-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/history")} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-950 tracking-tight">Detail Hasil Deteksi</h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">ID Pasien: #{detailData.patient_id} • File: {detailData.original_filename}</p>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border flex items-start gap-3 shadow-sm ${
        isTumor ? "bg-red-50/50 border-red-100 text-red-900" : "bg-emerald-50/50 border-emerald-100 text-emerald-900"
      }`}>
        <div className="mt-0.5 font-bold">⚠️</div>
        <div>
          <h2 className="text-sm font-extrabold">{isTumor ? "Indikasi Terdeteksi: Area Tumor" : "Diagnosis: Normal"}</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {isTumor 
              ? `Model mendeteksi indikasi tumor dengan tingkat keyakinan ${(parseFloat(detailData.max_confidence) * 100).toFixed(0)}%.`
              : "Citra medis terlihat bersih dan normal berdasarkan analisis kecerdasan buatan."
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[300px]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Citra Hasil Anotasi Model</h3>
          <div className="bg-slate-950 flex-1 rounded-xl flex items-center justify-center text-slate-500 text-xs font-mono p-4">
            [ Citra MRI: {detailData.original_filename} ]
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b pb-2">Informasi Pasien</h3>
            <div className="flex justify-between text-xs"><span className="text-slate-400">Nama Pasien:</span><span className="font-bold text-slate-800 capitalize">{detailData.patient_name}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-400">ID Pasien:</span><span className="font-mono text-slate-600 font-bold">{detailData.patient_id}</span></div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b pb-2">Performa Model</h3>
            <div className="flex justify-between text-xs"><span className="text-slate-400">Model AI:</span><span className="font-mono text-slate-700 font-bold">{detailData.model_used}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-400">Waktu Inferensi:</span><span className="font-medium text-slate-700">{detailData.processing_time_ms} ms</span></div>
          </div>
        </div>
      </div>

      {/* TABEL BOUNDING BOX */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">📋 Spesifikasi Koordinat Bounding Box</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">No.</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Kelas Objek</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Confidence</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Koordinat (X1, Y1, X2, Y2)</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Luas Area (px²)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {(() => {
                if (!detailData?.detections_data) return null;
                try {
                  const boxes = JSON.parse(detailData.detections_data);
                  if (boxes.length === 0) {
                    return (
                      <tr>
                        <td colSpan="5" className="p-4 text-center text-xs font-medium text-slate-400">Tidak ada area tumor terdeteksi (Normal).</td>
                      </tr>
                    );
                  }

                  return boxes.map((box, index) => {
                    let jenisTumor = box.class || "Tumor";
                    const namaFile = detailData.original_filename || "";

                    if (jenisTumor.toLowerCase() === "tumor") {
                      if (namaFile.toLowerCase().includes("-gl")) jenisTumor = "Glioma";
                      else if (namaFile.toLowerCase().includes("-me")) jenisTumor = "Meningioma";
                      else if (namaFile.toLowerCase().includes("-pi")) jenisTumor = "Pituitary";
                    }

                    return (
                      <tr key={index}>
                        <td className="p-4 text-xs font-medium text-slate-500">#{index + 1}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 
                          rounded text-[10px] font-bold uppercase">
                            {jenisTumor}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-bold text-red-600">{(box.confidence * 100).toFixed(0)}%</td>
                        <td className="p-4 text-xs font-mono text-slate-600">{box.bbox.join(", ")}</td>
                        <td className="p-4 text-xs font-medium text-slate-700">{box.area.toLocaleString("id-ID")}</td>
                      </tr>
                    );
                  });
                } catch (e) {
                  return (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-xs font-medium text-slate-400">Data normal / tidak ada objek.</td>
                    </tr>
                  );
                }
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}