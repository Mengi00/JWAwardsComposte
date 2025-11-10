import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const voterFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  rut: z.string().regex(/^[0-9]{7,8}-[0-9Kk]$/, "Formato de RUT inválido (ej: 12345678-9)"),
  correo: z.string().email("Correo electrónico inválido"),
  telefono: z.string().regex(/^\+?[0-9]{8,12}$/, "Teléfono inválido (8-12 dígitos)"),
});

export type VoterFormData = z.infer<typeof voterFormSchema>;

interface VoterFormProps {
  onSubmit: (data: VoterFormData) => void;
  isLoading?: boolean;
}

export default function VoterForm({ onSubmit, isLoading }: VoterFormProps) {
  const form = useForm<VoterFormData>({
    resolver: zodResolver(voterFormSchema),
    defaultValues: {
      nombre: "",
      rut: "",
      correo: "",
      telefono: "",
    },
  });

  return (
    <Card className="max-w-2xl mx-auto p-8 border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
      <div className="mb-8">
        <h2 className="text-3xl font-black uppercase mb-2">Tus Datos</h2>
        <p className="text-muted-foreground font-semibold">
          Completa el formulario para registrar tu voto
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-black uppercase">Nombre Completo</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-4 border-input py-6 text-lg font-semibold"
                    placeholder="Juan Pérez"
                    data-testid="input-nombre"
                  />
                </FormControl>
                <FormMessage className="font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rut"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-black uppercase">RUT</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-4 border-input py-6 text-lg font-semibold"
                    placeholder="12345678-9"
                    data-testid="input-rut"
                  />
                </FormControl>
                <FormMessage className="font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-black uppercase">Correo Electrónico</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="border-4 border-input py-6 text-lg font-semibold"
                    placeholder="ejemplo@correo.com"
                    data-testid="input-correo"
                  />
                </FormControl>
                <FormMessage className="font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-black uppercase">Teléfono</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    className="border-4 border-input py-6 text-lg font-semibold"
                    placeholder="+56912345678"
                    data-testid="input-telefono"
                  />
                </FormControl>
                <FormMessage className="font-bold" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full text-xl py-8 font-black uppercase border-4"
            disabled={isLoading}
            data-testid="button-submit-vote"
          >
            {isLoading ? "Enviando..." : "Enviar Voto"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
