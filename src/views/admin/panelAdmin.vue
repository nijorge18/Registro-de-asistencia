<template>
  <div class="auth-box d-flex align-items-center min-vh-100 bg-light">
    <BContainer class="mt-3" fluid="xxl">
      <BCard no-body class="rounded-4 shadow">
        <BRow class="justify-content-center align-items-center">
          <h2 class="">Panel de administración</h2>

          <BCol cols="4">
            <BButton variant="success">Crear usuario</BButton>
          </BCol>
          <BCol cols="4">
            <BButton variant="warning">Modificar usuario</BButton>
          </BCol>
          <BCol cols="4">
            <BButton variant="danger">Eliminar usuario</BButton>
          </BCol>

          <BCard>
            <BListGroup>
              <BListGroupItem>Cras justo odio</BListGroupItem>
              <BListGroupItem>Dapibus ac facilisis in</BListGroupItem>
              <BListGroupItem>Dapibus ac facilisis in</BListGroupItem>
              <BListGroupItem>Morbi leo risus</BListGroupItem>
              <BListGroupItem>Porta ac consectetur ac</BListGroupItem>
              <BListGroupItem>Vestibulum at eros</BListGroupItem>
            </BListGroup>
          </BCard>


        </BRow>
      </BCard>

    </BContainer>
  </div>

</template>
<script setup lang="ts">
import type { Database } from '../../entities/supabase';

import { onMounted, ref } from 'vue'



</script>