import { describe, it, expect, vi, beforeEach } from 'vitest'
import AsistenciaService from '../AsistenciaService'

// Mock de supabase
vi.mock('../../../utils/supabaseClient', () => ({
  supabase: {
    from: vi.fn()
  }
}))

import { supabase } from '../../../utils/supabaseClient'

describe('AsistenciaService - marcarSalida', () => {
  let service: AsistenciaService

  beforeEach(() => {
    service = new AsistenciaService()
    vi.clearAllMocks()
  })

  it('debería actualizar hora de salida correctamente', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: {
        id_asistencia: 2,
        fecha: '2025-09-24',
        hora_ingreso: '08:45:00',
        hora_salida: '17:30:00',
        id_usuario: 'usuario123',
        usuario: null
      },
      error: null
    })

    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
    const mockEq = vi.fn().mockReturnValue({ select: mockSelect })
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq })

    ;(supabase.from as any).mockReturnValue({ update: mockUpdate })

    const result = await service.marcarSalida(2)

    expect(result).toEqual({
      id_asistencia: 2,
      fecha: '2025-09-24',
      hora_ingreso: '08:45:00',
      hora_salida: expect.any(String),
      id_usuario: 'usuario123',
      usuario: null
    })
  })

  it('debería lanzar error si la actualización falla', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Error al actualizar' }
    })

    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
    const mockEq = vi.fn().mockReturnValue({ select: mockSelect })
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq })

    ;(supabase.from as any).mockReturnValue({ update: mockUpdate })

    await expect(service.marcarSalida(2)).rejects.toThrow('Error al actualizar la hora de salida')
  })
})