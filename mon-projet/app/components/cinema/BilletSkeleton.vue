<template>
  <div class="billet">
    <div class="ligne titre"></div>
    <div class="ligne prix"></div>
    <div class="ligne quantite"></div>
    <div class="ligne bouton"></div>
    <div class="ligne bouton"></div>
  </div>
</template>

<style scoped>
.billet {
  border: 2px dotted #C9C9C9;
  padding: 32px 16px 16px;
  border-radius: 12px;
  background-color: #f9f9f9;
}

.ligne {
  height: 16px;
  border-radius: 6px;
  margin-bottom: 12px;
  background: #e2e2e2;
}

.titre  { width: 60%; height: 20px; }
.prix   { width: 10%; }
.quantite   { width: 40%; }
.bouton { width: 55%; height: 32px; margin-bottom: 12px; }

.ligne {
  /* remplace le background: #e2e2e2 */
  background: linear-gradient(90deg, #e2e2e2 25%, #f2f2f2 50%, #e2e2e2 75%);
  background-size: 200% 100%;
  animation: scintillement 1.5s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .ligne { animation: none; }
}

@keyframes scintillement {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
</style>