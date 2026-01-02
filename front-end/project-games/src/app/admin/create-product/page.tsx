"use client";

import { useState } from "react";
import styles from "../create-product.module.css";
import { FiPlus, FiPackage, FiFileText, FiImage, FiSave } from "react-icons/fi";
import { ProductServices } from "@/services/products/products.services";

export default function CreateProductPage() {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });


  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);

    try {
      await ProductServices.createProduct(formData);
      alert("Produto criado com sucesso!");
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
      });
    } catch (error: unknown) {
      console.error("Erro ao criar produto:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.createContainer}>
      <div className={styles.createHeader}>
        <h1 className={styles.createTitle}>
          <FiPlus className={styles.titleIcon} size={32} />
          Criar Novo Produto
        </h1>
        <p className={styles.createSubtitle}>Preencha os campos abaixo para adicionar um novo produto ao sistema</p>
      </div>

      <div className={styles.formWrapper}>
        <form className={styles.productForm} onSubmit={handleCreateProduct}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              <FiPackage className={styles.labelIcon} size={16} />
              Nome do Produto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              placeholder="Ex: MINECRAFT JAVA+BEDROCK ORIGINAL"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>


          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              <FiFileText className={styles.labelIcon} size={16} />
              Descrição
            </label>

            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              placeholder="Descreva o produto em detalhes..."
              rows={6}
              value={formData.description}
              onChange={handleInputChange}
            />

          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imageUrl" className={styles.label}>
              <FiImage className={styles.labelIcon} size={16} />
              URL da Imagem
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className={styles.input}
              placeholder="https://exemplo.com/imagem.jpg"
              value={formData.imageUrl}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              <FiSave className={styles.buttonIcon} size={20} />
              Criar Produto
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setFormData({
                  name: "",
                  description: "",
                  imageUrl: "",
                });
              }}
            >
              Limpar Formulário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
