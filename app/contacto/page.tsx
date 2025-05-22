"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulación de envío de formulario
    try {
      // En un caso real, aquí iría la lógica para enviar el formulario a un backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Mensaje enviado",
        description: "Hemos recibido tu mensaje. Te contactaremos pronto.",
      });

      // Limpiar formulario
      setFormData({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "No se pudo enviar tu mensaje. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Contáctanos</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Envíanos un mensaje</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="asunto">Asunto</Label>
                <Input
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensaje">Mensaje</Label>
                <Textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar mensaje
                  </>
                )}
              </Button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Información de contacto
            </h2>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-primary mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-semibold">Correo electrónico</h3>
                      <p className="text-gray-700">anvahechoamano@gmail.com </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-semibold">Teléfono</h3>
                      <p className="text-gray-700">+503 7865 9463</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-semibold">Dirección</h3>
                      <p className="text-gray-700">
                        Puerto El Triunfo, Puerto El Triunfo, El Salvador
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-semibold">Horario de atención</h3>
                      <p className="text-gray-700">
                        Lunes a Viernes: 9:00 AM - 6:00 PM
                      </p>
                      <p className="text-gray-700">
                        Sábados: 10:00 AM - 4:00 PM
                      </p>
                      <p className="text-gray-700">Domingos: Cerrado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Encuéntranos
          </h2>
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src="/logos/logo_principal_letras.png"
              alt="Ubicación de nuestra tienda"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
