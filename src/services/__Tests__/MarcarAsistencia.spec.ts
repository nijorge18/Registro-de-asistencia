import { describe, it, expect, vi, beforeEach } from 'vitest';
import AsistenciaService from '../AsistenciaService';
import { supabase } from '../../../utils/supabaseClient';

vi.mock('../../../utils/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('AsistenciaService - marcarAsistencia', () => {
  let service: AsistenciaService;

  beforeEach(() => {
    service = new AsistenciaService();
    // Limpia todos los mocks antes de cada prueba para asegurar el aislamiento
    vi.clearAllMocks();
  });

  it('debería lanzar error si ya existe asistencia para hoy', async () => {
    // Mock de la respuesta para la primera prueba (SELECT)
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id_asistencia: 1 },
            error: null,
          }),
        }),
      }),
    });
    
    // Mockea supabase.from para que devuelva la cadena de llamadas del SELECT
    (supabase.from as any).mockReturnValue({ select: selectMock });

    await expect(service.marcarAsistencia('usuario123')).rejects.toThrow(
      'Ya has marcado tu asistencia para hoy'
    );
  });

  it('debería crear asistencia si no existe y retornar el objeto', async () => {
    // Mock para la primera llamada (SELECT): simula que no existe una asistencia
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      }),
    });

    // Mock para la segunda llamada (INSERT): simula la creación de la asistencia
    const insertMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id_asistencia: 2,
            fecha: '2025-09-24',
            hora_ingreso: '08:45:00',
            hora_salida: null,
            id_usuario: 'usuario123',
            usuario: null,
          },
          error: null,
        }),
      }),
    });

    // Mockea supabase.from para que responda de manera diferente en llamadas sucesivas
    (supabase.from as any)
      .mockReturnValueOnce({ select: selectMock }) // Primera llamada: devuelve el mock del SELECT
      .mockReturnValueOnce({ insert: insertMock }); // Segunda llamada: devuelve el mock del INSERT
    
    const result = await service.marcarAsistencia('usuario123');

    // La aserción corregida debe coincidir con la respuesta del mock
    expect(result).toEqual({
      id_asistencia: 2,
      fecha: '2025-09-24',
      hora_ingreso: expect.any(String),
      hora_salida: null,
      id_usuario: 'usuario123',
      usuario: null,
    });
  });
});