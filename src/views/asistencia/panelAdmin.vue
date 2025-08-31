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


        </BRow>
      </BCard>

    </BContainer>
  </div>

</template>
<script setup lang="ts">

</script>