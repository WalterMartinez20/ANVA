/*
Estoy desarrollando un sistema de tienda online en Next JS.
Algunas aclaraciones importantes:

Ya tengo gran parte del proyecto generado usando V0.dev (Dev Chat). El proyecto tiene varios archivos distribuidos en carpetas (app/api, components, contexts, hooks, lib, etc.). No puedo subir todo el proyecto porque es demasiado grande, así que quiero trabajar por bloques.
Necesito que me ayudes a:
Revisar errores de lógica o estructura en lo que ya está hecho.
Mejorarlo, pero sin reescribirlo todo de cero (solo corregir o sugerir mejoras).
¿Te parece si empezamos? Yo te iré pasando el código por bloques, en el orden que te comento abajo.

*--------------------------------------------*--------------------------------------------*--------------------------------------------
La idea es que hacer un crud de categorias desde el admin, para que el admin pueda crear y editar las categorias,
como puedo hacer eso para que al darle click a los botones de main-categories me redirigan a sus categorias, pero estas sean dinamicas, es decir,
la card 1 redirige a categoria/bolsos, pero en el futuro quiero editar esa categoria o poner otra como por ejemplo /categoria/carteras, quiero poder cambiar dinamicamente a que
categoria me redigira cada card. Tengo pensado algo como que el admin pueda crear sus propias cards y que pueda editarlas, como el texto, imagen que se muestra, la categoria a la que
se redirecciona, etc. Ademas, sobre ese tema, quiero tambien hacer lo mismo con el slider de la home, ya que quiero que el admin pueda editar todo el slider, cuantos items quiere poner, que
texto e imagenes mostrar, a donde redirige el link, etc., y lo demas seria como lo que habias dicho, de tener una vista para la busqueda y otra para las carteras, que necesitaria para hacer todo eso?
Porque ya tengo varios cruds como el de productos y materiales, pero quiero hacer la pagina mas personalizada agregandole esos otros cruds del slider y las categorias. Por el momento ayudame a hacer las paginas
de busqueda y categoria de productos, luego que ya este todo eso implementemos que sea dinamico por medio del panel del admin
*/

// * ----------------------------------------* ---Este es un diseño alternativo a la vista de productos-----------* -------------------
"use client";

import { useState, useEffect } from "react";
import { Minus, Plus, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/breadcrumb";
import { useCart } from "@/components/cart-provider";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: number;
  url: string;
  isMain: boolean;
}

interface Material {
  id: number;
  name: string;
  unit: string | null;
}

interface ProductMaterial {
  materialId: number;
  quantity: number;
  material: Material;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  images: ProductImage[];
  materials: ProductMaterial[];
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = (useState < Product) | (null > null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [activeTab, setActiveTab] = (useState < string) | (null > null);
  const { addItem } = useCart();
  const { user, isGuest } = useAuth();

  // Cargar detalles del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) throw new Error("Error al cargar el producto");

        const data = await response.json();
        setProduct(data.product);

        // Establecer la imagen principal
        const mainImg = data.product.images.find(
          (img: ProductImage) => img.isMain
        );
        setMainImage(mainImg ? mainImg.url : data.product.images[0]?.url || "");
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el producto",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  // Verificar si el producto está en favoritos
  useEffect(() => {
    if (isGuest || !user) return;

    const checkFavorite = async () => {
      try {
        const response = await fetch("/api/favorites");
        if (!response.ok) return;

        const data = await response.json();
        const isFav = data.favorites.some(
          (fav: any) => fav.productId === Number(params.id)
        );
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error al verificar favoritos:", error);
      }
    };

    checkFavorite();
  }, [params.id, user, isGuest]);

  const handleThumbnailClick = (image: string) => {
    setMainImage(image);
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast({
        title: "Límite alcanzado",
        description: "No hay más unidades disponibles",
      });
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]?.url || "/placeholder.svg?height=80&width=80",
    });

    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido al carrito`,
    });
  };

  const toggleFavorite = async () => {
    if (isGuest) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar favoritos",
      });
      return;
    }

    if (!product) return;

    setIsAddingToFavorites(true);

    try {
      if (isFavorite) {
        // Eliminar de favoritos
        const response = await fetch(`/api/favorites/${product.id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Error al eliminar de favoritos");

        setIsFavorite(false);
        toast({
          title: "Eliminado de favoritos",
          description: `${product.name} ha sido eliminado de tus favoritos`,
        });
      } else {
        // Añadir a favoritos
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: product.id }),
        });

        if (!response.ok) throw new Error("Error al añadir a favoritos");

        setIsFavorite(true);
        toast({
          title: "Añadido a favoritos",
          description: `${product.name} ha sido añadido a tus favoritos`,
        });
      }
    } catch (error) {
      console.error("Error al gestionar favoritos:", error);
      toast({
        title: "Error",
        description: "No se pudo completar la operación",
        variant: "destructive",
      });
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  const toggleTab = (tab: string) => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Comedor y bar", href: "/categoria/comedor-y-bar" },
    { label: "Botellas y termos", href: "/categoria/botellas-y-termos" },
    { label: "Botellas", href: "/categoria/botellas" },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse w-full max-w-6xl">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/12">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded mb-3 w-full"
                  ></div>
                ))}
              </div>
              <div className="md:w-5/12">
                <div className="aspect-square bg-gray-200 rounded w-full"></div>
              </div>
              <div className="md:w-6/12 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <p>
          Lo sentimos, el producto que buscas no existe o ha sido eliminado.
        </p>
        <Button className="mt-4" asChild>
          <a href="/">Volver a la tienda</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-4 max-w-[1200px]">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* Miniaturas a la izquierda */}
          <div className="hidden md:block md:w-[80px]">
            <div className="space-y-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => handleThumbnailClick(img.url)}
                  className={cn(
                    "w-full aspect-square border rounded overflow-hidden transition-all",
                    mainImage === img.url
                      ? "border-gray-400"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <img
                    src={img.url || "/placeholder.svg"}
                    alt={`${product.name} vista ${img.id}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Imagen principal */}
          <div className="md:w-[400px]">
            <div className="aspect-square relative rounded overflow-hidden border border-gray-100">
              <img
                src={mainImage || "/placeholder.svg"}
                alt={product.name}
                className="object-contain w-full h-full"
              />
            </div>

            {/* Miniaturas móviles */}
            <div className="flex gap-2 mt-3 md:hidden overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => handleThumbnailClick(img.url)}
                  className={cn(
                    "w-16 h-16 flex-shrink-0 border rounded overflow-hidden",
                    mainImage === img.url
                      ? "border-gray-400"
                      : "border-gray-200"
                  )}
                >
                  <img
                    src={img.url || "/placeholder.svg"}
                    alt={`${product.name} vista ${img.id}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="md:flex-1">
            <div className="border border-gray-200 rounded p-4">
              <h1 className="text-xl font-medium text-gray-900">
                {product.name} <span className="font-bold">STANLEY</span>
              </h1>

              <div className="mt-4">
                <span className="text-3xl font-bold text-red-500">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-gray-500 ml-1">Uni</span>

                <div className="mt-2 flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    {product.stock} Disponible(s)
                  </span>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-700">
                    SKU#: {product.id}{" "}
                    <span className="ml-4">Modelo: 10-11825-048</span>
                  </p>
                </div>
              </div>

              {/* Selector de cantidad */}
              <div className="mt-4">
                <div className="flex items-center border border-gray-300 rounded w-[120px]">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="flex-1 text-center border-none focus:ring-0 p-0 h-8"
                  />
                  <button
                    onClick={incrementQuantity}
                    disabled={product.stock <= quantity}
                    className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-4 flex items-center gap-2">
                <Button
                  className="flex-1 py-5 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  Agregar al carrito
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-[42px] w-[42px] border-gray-300"
                  onClick={toggleFavorite}
                  disabled={isAddingToFavorites}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
              </div>

              <div className="mt-4">
                <button className="text-blue-500 text-sm hover:underline">
                  Consulta la disponibilidad
                </button>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium text-gray-900">
                  Manuales y documentos
                </h3>
                <div className="mt-2">
                  <button className="text-gray-700 text-sm border-b border-gray-300 hover:border-gray-500">
                    Advertencia de uso
                  </button>
                </div>
              </div>
            </div>

            {/* Contador de visitas */}
            <div className="mt-4 text-sm text-gray-700 flex items-center justify-center">
              <span>
                Visto por {Math.floor(Math.random() * 300) + 500} personas
              </span>
              <span className="ml-1 text-orange-500">🔥</span>
            </div>
          </div>
        </div>

        {/* Tabs de información adicional */}
        <div className="mt-8">
          <div className="border-t border-b py-4">
            <button
              onClick={() => toggleTab("description")}
              className="w-full flex justify-between items-center py-2"
            >
              <span className="font-medium text-lg">Descripción</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  activeTab === "description" ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {activeTab === "description" && (
              <div className="py-4">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Vaso térmico de 887 ml color azul navy</li>
                  <li>Mantiene bebidas calientes hasta por 7 horas</li>
                  <li>Mantiene bebidas frías hasta por 10 horas</li>
                  <li>Tapa con cierre hermético</li>
                  <li>Material de acero inoxidable de alta calidad</li>
                  <li>Diseño ergonómico con asa para fácil transporte</li>
                  <li>Ideal para uso diario, camping, oficina o viajes</li>
                  <li>Libre de BPA</li>
                  <li>Fácil de limpiar</li>
                </ul>
              </div>
            )}
          </div>

          <div className="border-b py-4">
            <button
              onClick={() => toggleTab("specifications")}
              className="w-full flex justify-between items-center py-2"
            >
              <span className="font-medium text-lg">Especificaciones</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  activeTab === "specifications" ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {activeTab === "specifications" && (
              <div className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <span className="font-medium w-40">Marca:</span>
                    <span>Stanley</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-40">Modelo:</span>
                    <span>10-11825-048</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-40">Capacidad:</span>
                    <span>887 ml</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-40">Material:</span>
                    <span>Acero inoxidable</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-40">Color:</span>
                    <span>Azul Navy</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-40">Dimensiones:</span>
                    <span>9 x 9 x 20 cm</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-40">Peso:</span>
                    <span>0.45 kg</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-40">Garantía:</span>
                    <span>5 años</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-b py-4">
            <button
              onClick={() => toggleTab("payment")}
              className="w-full flex justify-between items-center py-2"
            >
              <span className="font-medium text-lg">Pago y Envío</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  activeTab === "payment" ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {activeTab === "payment" && (
              <div className="py-4">
                <h3 className="font-medium mb-2">Métodos de pago aceptados</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  <img
                    src="/placeholder.svg?height=30&width=45&text=VISA"
                    alt="Visa"
                    className="h-8"
                  />
                  <img
                    src="/placeholder.svg?height=30&width=45&text=MC"
                    alt="Mastercard"
                    className="h-8"
                  />
                  <img
                    src="/placeholder.svg?height=30&width=45&text=AMEX"
                    alt="American Express"
                    className="h-8"
                  />
                  <img
                    src="/placeholder.svg?height=30&width=45&text=PayPal"
                    alt="PayPal"
                    className="h-8"
                  />
                </div>

                <h3 className="font-medium mb-2">Opciones de envío</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Envío estándar: 3-5 días hábiles ($5.99)</li>
                  <li>Envío express: 1-2 días hábiles ($12.99)</li>
                  <li>Envío gratis en compras mayores a $100</li>
                  <li>Retiro en tienda disponible</li>
                </ul>

                <h3 className="font-medium mt-4 mb-2">
                  Política de devoluciones
                </h3>
                <p className="text-sm text-gray-600">
                  Aceptamos devoluciones dentro de los 30 días posteriores a la
                  compra. El producto debe estar en su estado original y con
                  todas las etiquetas.
                </p>
              </div>
            )}
          </div>

          <div className="border-b py-4">
            <button
              onClick={() => toggleTab("reviews")}
              className="w-full flex justify-between items-center py-2"
            >
              <span className="font-medium text-lg">Reviews</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  activeTab === "reviews" ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {activeTab === "reviews" && (
              <div className="py-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">4.5</div>
                    <div className="flex justify-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill={i < 4 ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">12 reseñas</div>
                  </div>

                  <div className="flex-1">
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <div className="text-sm w-2">{star}</div>
                          <svg
                            className="h-4 w-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{
                                width: `${
                                  star === 5
                                    ? 70
                                    : star === 4
                                    ? 20
                                    : star === 3
                                    ? 5
                                    : star === 2
                                    ? 3
                                    : 2
                                }%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 w-8">
                            {star === 5
                              ? "70%"
                              : star === 4
                              ? "20%"
                              : star === 3
                              ? "5%"
                              : star === 2
                              ? "3%"
                              : "2%"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full sm:w-auto">
                  Escribir una reseña
                </Button>

                <div className="space-y-4 mt-4">
                  <h3 className="font-medium">Reseñas de clientes</h3>

                  {/* Reseñas de ejemplo */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">María L.</div>
                      <div className="text-gray-500 text-sm">
                        Hace 2 semanas
                      </div>
                    </div>
                    <div className="flex mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < 5 ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill={i < 5 ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-2 text-sm">
                      Excelente producto, el color es exactamente como se
                      muestra en las fotos. La calidad es muy buena y el tamaño
                      es perfecto para lo que necesitaba.
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">Carlos R.</div>
                      <div className="text-gray-500 text-sm">Hace 1 mes</div>
                    </div>
                    <div className="flex mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill={i < 4 ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-2 text-sm">
                      Lo compré para mi esposa y está muy contenta. La entrega
                      fue rápida y el producto llegó en perfectas condiciones.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
