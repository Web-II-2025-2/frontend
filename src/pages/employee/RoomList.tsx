import { useState, useEffect } from "react";
import api from "../../services/api";
import { Tag } from "../../components/layout/ControlPlaneUI";
import "../styles/roomList.css";

type RoomType = 'SINGLE' | 'STANDARD_CASAL' | 'DELUXE' | 'SUITE';
type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'DIRTY' | 'MAINTENANCE';

interface Quarto {
    id: number;
    number: number;
    type: RoomType;
    status: RoomStatus;
    dailyRate: number;
}

const STATUS_CONFIG: Record<RoomStatus, { color: string; bg: string; label: string }> = {
  AVAILABLE: { color: "#4a9060", bg: "#4a906014", label: "Disponível" },
  OCCUPIED:  { color: "#7a5a9a", bg: "#7a5a9a14", label: "Ocupado" },
  DIRTY:     { color: "#b05a2a", bg: "#b05a2a14", label: "Sujo / Limpeza" },
  MAINTENANCE: { color: "#8a6a20", bg: "#8a6a2014", label: "Manutenção" },
};

const ROOM_IMAGES: Record<RoomType, string[]> = {
  STANDARD_CASAL: ["https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=600&q=80"],
  DELUXE: [
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
  ],
  SUITE: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80"],
  SINGLE: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"],
};

function QuartoCard({ 
  quarto, 
  onClean 
}: { 
  quarto: Quarto; 
  onClean: (id: number) => void 
}) {
  const isDirty = quarto.status === 'DIRTY';
  const st = STATUS_CONFIG[quarto.status] || { color: "#8a8a7a", bg: "#8a8a7a14", label: quarto.status };
  const imgs = ROOM_IMAGES[quarto.type] || ROOM_IMAGES["STANDARD_CASAL"];
  const img = imgs[quarto.id % imgs.length];

  return (
    <div className={`quarto-card ${isDirty ? 'dirty-status' : ''}`}>
      <div className="quarto-card-image-wrap">
        <img src={img} alt={`Quarto ${quarto.type}`} className="quarto-card-image" />
        <div className="quarto-card-type-badge">{quarto.type.replace('_', ' ')}</div>
      </div>

      <div className="quarto-card-info">
        <div className="quarto-card-top-row">
          <div>
            <div className="quarto-card-title">Quarto {quarto.number}</div>
          </div>
          <span className="quarto-card-status" style={{ background: st.bg, color: st.color }}>
            {st.label}
          </span>
        </div>

        <div className="quarto-card-bottom-row">
          <div>
            <div className="quarto-card-price-label">Diária</div>
            <div className="quarto-card-price-value">R$ {quarto.dailyRate.toLocaleString("pt-BR")}</div>
          </div>
          
          {isDirty ? (
            <button 
              className="btn-limpar-quarto" 
              onClick={() => onClean(quarto.id)}
              style={{ background: st.color, color: '#fff', border: 'none' }}
            >
              Limpar Quarto
            </button>
          ) : (
            <button className="btn-detalhes-quarto">Editar</button>
          )}
        </div>
      </div>
    </div>
  );
}

export function RoomList() {
  const [quartos, setQuartos] = useState<Quarto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [busca, setBusca] = useState("");

  const fetchQuartos = async () => {
    try {
      const { data } = await api.get("/rooms");
      setQuartos(data);
    } catch (err) {
      console.error("Erro ao buscar quartos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuartos();
  }, []);

  const handleCleanRoom = async (id: number) => {
    try {
      await api.patch(`/employees/${id}`, { status: 'AVAILABLE' });
      
      setQuartos(prev => prev.map(q => 
        q.id === id ? { ...q, status: 'AVAILABLE' as RoomStatus } : q
      ));
      
      alert(`Quarto finalizado com sucesso!`);
    } catch (err) {
      alert("Erro ao atualizar status do quarto.");
    }
  };

  const filtered = quartos.filter(q => {
    const matchTipo = filtroTipo === "Todos" || q.type === filtroTipo;
    const matchBusca = busca === "" || q.number.toString().includes(busca) || q.type.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchBusca;
  });

  if (loading) return <div className="quarto-list-loading">Carregando quartos...</div>;

  return (
    <div className="quarto-list-page">
      <div className="quarto-list-header">
        <Tag color="#7a4f2e">Hospedagem</Tag>
        <h2 className="quarto-list-title">Quartos</h2>
      </div>

      <div className="quarto-list-filters">
        <input
          className="search-input-quarto"
          placeholder="Buscar quarto..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <select className="select-filter-quarto" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
            <option value="Todos">Todos os tipos</option>
            <option value="SINGLE">Single</option>
            <option value="STANDARD_CASAL">Standard Casal</option>
            <option value="DELUXE">Deluxe</option>
            <option value="SUITE">Suíte</option>
        </select>
      </div>

      <div className="quarto-list-grid">
        {filtered.length > 0 ? (
          filtered.map(q => (
            <QuartoCard key={q.id} quarto={q} onClean={handleCleanRoom} />
          ))
        ) : (
          <p className="no-results">Nenhum quarto encontrado.</p>
        )}
      </div>
    </div>
  );
}