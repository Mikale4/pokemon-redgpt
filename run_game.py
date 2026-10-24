from __future__ import annotations
import contextlib
import http.server
import os
import socket
import socketserver
import threading
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    """Serves the game without logging, and without letting the browser cache.

    Chrome caches these scripts hard enough that editing a file under src/ and
    reloading often still runs the old code, which has repeatedly looked like a
    change "not working" when it had simply never been fetched. Nothing here is
    served over a network, so caching buys nothing and costs debugging time.
    """

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format: str, *args: object) -> None:
        pass

def free_port() -> int:
    with contextlib.closing(socket.socket()) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])

if __name__ == "__main__":
    # Optional arguments, both for driving the game from a tool rather than by
    # hand: a fixed port (an embedded browser pane has to be told where to look,
    # and a random one changes every launch) and --no-browser (so starting the
    # server does not also throw open a separate external window). With no
    # arguments the launcher behaves exactly as it always has.
    import sys

    args = sys.argv[1:]
    open_browser = "--no-browser" not in args
    ports = [a for a in args if a.isdigit()]
    port = int(ports[0]) if ports else free_port()

    with socketserver.ThreadingTCPServer(("127.0.0.1", port), QuietHandler) as server:
        url = f"http://127.0.0.1:{port}/index.html"
        print("Pokémon RedGPT is running.")
        print(f"Open {url} if your browser does not open automatically.")
        print("Close this window or press Ctrl+C to stop the local server.")
        if open_browser:
            threading.Timer(0.6, lambda: webbrowser.open(url)).start()
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nPokémon RedGPT closed.")
