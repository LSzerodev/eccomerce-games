"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./admin-layout.module.css";
import { AdminAuthProvider } from "@/context/AdminAuthProvider";
import { AdminGuard } from "@/components/admin/AdminGuard";
import {
  FiPackage,
  FiPlus,
  FiList,
  FiMenu,
  FiX
} from "react-icons/fi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      href: "/admin/create-product",
      label: "Criar Produto",
      icon: FiPlus,
    },
    {
      href: "/admin/products",
      label: "Listar Produtos",
      icon: FiList,
    },
    {
      href: "/admin/create-product-options",
      label: "Adicionar Opções",
      icon: FiPlus,
    },
  ];

  const isActive = (href: string) => {
    return pathname?.startsWith(href);
  };

  // Não mostrar sidebar na página de acesso negado
  const isAccessDeniedPage = pathname === '/admin/access-denied';

  return (
    <AdminAuthProvider>
      <AdminGuard>
        {isAccessDeniedPage ? (
          // Página de acesso negado sem sidebar
          <>{children}</>
        ) : (
          // Páginas admin com sidebar
          <div className={styles.adminLayout}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoSection}>
            <FiPackage className={styles.logoIcon} size={28} />
            <h2 className={styles.logoText}>Admin Panel</h2>
          </div>
          <button
            className={styles.toggleButton}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                  >
                    <Icon className={styles.navIcon} size={20} />
                    {sidebarOpen && <span className={styles.navLabel}>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
              {children}
            </main>
          </div>
        )}
      </AdminGuard>
    </AdminAuthProvider>
  );
}
