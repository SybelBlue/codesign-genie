<script>
  // Add any necessary imports or logic here
  import ThemeChanger from '$lib/components/ThemeChange.svelte';
</script>

<header class="bg-primary text-primary-content shadow-md">
  <div class="container mx-auto px-4 py-2 flex items-center justify-between">
    <h1 class="text-xl font-bold">Cara: Your Codesign Genie</h1>
    <nav>
      <!-- Add navigation items or other toolbar content here -->
      <a href="/" class="px-2 py-1 hover:underline">Home</a>
      <a href="/about" class="px-2 py-1 hover:underline">About</a>
      <ThemeChanger />
    </nav>
  </div>
</header>
