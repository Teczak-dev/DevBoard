#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .setup(|_app| {
            // Removed log plugin to avoid permission issues
            // Log functionality can be re-enabled later with proper permissions
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
