import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { criarProduto } from "../auth/ProdutoClient.js";
import TextField from "../components/TextField.jsx";
import FormAlert from "../components/FormAlert.jsx";

function CadastroProduto() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [comissao, setComissao] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  
  const [alert, setAlert] = useState({ message: "", variant: "error" });

  async function handleSubmit(event) {
    event.preventDefault();

    if (!nome || !preco) {
      setAlert({ message: "Nome e preço são obrigatórios.", variant: "error" });
      return;
    }

    try {
      const payload = {
        storeId: user.id, 
        name: nome,
        price: parseFloat(preco),
        commissionPercentage: comissao ? parseFloat(comissao) : 0,
        imageUrl: imagemUrl
      };

      await criarProduto(payload);

      setAlert({ message: "Produto cadastrado com sucesso!", variant: "success" });
      setTimeout(() => navigate("/dashboard/store", { replace: true }), 1000);
      
    } catch (err) {
      setAlert({ message: err.message || "Erro ao cadastrar produto.", variant: "error" });
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 20px" }}>
      <main style={{ 
        width: "100%", 
        maxWidth: "600px", 
        backgroundColor: "#ffffff", 
        padding: "40px", 
        borderRadius: "12px", 
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" 
      }}>
        
        <h2 style={{ marginTop: 0, marginBottom: "24px", color: "#333" }}>
          Cadastrar Novo Produto
        </h2>
        
        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {alert.message && (
            <FormAlert message={alert.message} variant={alert.variant} />
          )}

          <TextField
            id="nome"
            label="Nome do Produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Camiseta MyVitrine"
          />

          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <TextField
                id="preco"
                label="Preço (R$)"
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Ex: 99.90"
              />
            </div>
            <div style={{ flex: 1 }}>
              <TextField
                id="comissao"
                label="Comissão Afiliados (%)"
                type="number"
                step="0.1"
                value={comissao}
                onChange={(e) => setComissao(e.target.value)}
                placeholder="Ex: 15.0"
              />
            </div>
          </div>

          <TextField
            id="imagemUrl"
            label="URL da Imagem"
            value={imagemUrl}
            onChange={(e) => setImagemUrl(e.target.value)}
            placeholder="https://..."
          />

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button 
              type="submit" 
              style={{ 
                backgroundColor: "#b33966", 
                color: "#fff", 
                border: "none", 
                padding: "12px 24px", 
                borderRadius: "6px", 
                cursor: "pointer", 
                fontWeight: "bold",
                flex: 1
              }}>
              Salvar Produto
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/dashboard/store")}
              style={{ 
                backgroundColor: "#f5f5f5", 
                color: "#333", 
                border: "1px solid #ccc", 
                padding: "12px 24px", 
                borderRadius: "6px", 
                cursor: "pointer", 
                fontWeight: "bold"
              }}>
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CadastroProduto;