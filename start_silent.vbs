Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\bhagi\.gemini\antigravity\scratch\map-earning-portal"
WshShell.Run "node server.js", 0, False
