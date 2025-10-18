q
salir
exit
# 1. Iniciar tmux
tmux
# 2. Verás una barra verde abajo - ¡estás dentro de tmux!
# 3. Navegar a tu proyecto
cd facebook-autopublisher
# 4. Ahora puedes usar Neovim sin miedo
nvim package.json
# 1. Iniciar tmux
tmux
# 2. Verás una barra verde abajo - ¡estás dentro de tmux!
# 3. Navegar a tu proyecto
cd facebook-autopublisher
# 4. Ahora puedes usar Neovim sin miedo
nvim package.json
# Dentro de tmux, escribe:
exit
# Ver que la sesión sigue activa
tmux ls
# Ver el output de lo que está pasando
tmux capture-pane -p -t nvim_setup
# Volver a ver la instalación en vivo
tmux attach -t nvim_setup
# Desde DENTRO de tmux donde estás:
exit
