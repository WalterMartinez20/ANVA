// * Muestra las tarjetas de estadísticas del usuario: pedidos, favoritos, reseñas y total gastado.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Heart, Star } from "lucide-react";

interface Stats {
  totalOrders: number;
  favoritesCount: number;
  totalSpent: number;
}

export const ProfileStatsCard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    favoritesCount: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/users/stats");
        const data = await res.json();
        if (data.stats) {
          setStats({
            totalOrders: data.stats.totalOrders || 0,
            favoritesCount: data.stats.favoritesCount || 0,
            totalSpent: data.stats.totalSpent || 0,
          });
        }
      } catch (error) {
        console.error("Error al cargar estadísticas", error);
      }
    };

    fetchStats();
  }, []);

  const level = Math.min(5, Math.floor(stats.totalOrders / 5) + 1);
  const nextLevelAt = level * 5;
  const progressPercent = Math.min(
    100,
    (stats.totalOrders / nextLevelAt) * 100
  );

  return (
    <Card className="shadow-md border border-gray-100 bg-white rounded-xl p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center">
        {/* poner esto en los estilos: (md:grid-cols-4) si se agregan las reseñas*/}
        {/* Pedidos */}
        <Link
          href="/pedidos"
          className="flex flex-col items-center justify-center text-center p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition h-full"
        >
          <ShoppingBag className="h-6 w-6 mb-2 text-primary" />
          <p className="text-lg font-semibold text-gray-900">
            {stats.totalOrders}
          </p>
          <p className="text-sm text-muted-foreground">Pedidos</p>
        </Link>
        {/* Favoritos */}
        <Link
          href="/favoritos"
          className="flex flex-col items-center justify-center text-center p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition h-full"
        >
          <Heart className="h-6 w-6 mb-2 text-red-500" />
          <p className="text-lg font-semibold text-gray-900">
            {stats.favoritesCount}
          </p>
          <p className="text-sm text-muted-foreground">Favoritos</p>
        </Link>

        {/* Reseñas */}
        {/* <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Star className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
          <p className="text-lg font-semibold">0</p>
          <p className="text-xs text-muted-foreground">Reseñas</p>
        </div> */}

        {/* Total gastado */}
        <div className="flex flex-col items-center justify-center text-center p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition h-full">
          <p className="text-lg font-semibold text-gray-900">
            ${stats.totalSpent.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">Total gastado</p>
        </div>
        {/* Espaciador opcional para mantener simetría en grid */}
        <div className="hidden md:block" />
      </div>

      {/* Nivel de cliente */}
      {/* <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Nivel de Cliente</span>
          <span className="text-sm text-primary font-medium">
            Nivel {level}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#e0cfc7] overflow-hidden">
          <div
            className="h-full bg-[#a67c6b]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Realiza {nextLevelAt - stats.totalOrders} pedidos más para subir al
          siguiente nivel
        </p>
      </div> */}
    </Card>
  );
};
