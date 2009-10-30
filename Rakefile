require "fileutils"

desc "package all js files into one (needs java to run yuicompressor in order to minify and compress script)"
task :package do
  FileUtils.mkdir("pkg") unless File.exist?("pkg")

  files = %w(google_maps_extensions tile_overlay spatial_map activity_layer data_map data_map_manager)

  File.open("pkg/active_tile.js", "w") do |active_tile|
    files.each do |file|
      active_tile.puts File.read("lib/#{file}.js")
    end
  end

  `java -jar vendor/yuicompressor.jar --nomunge --type js -o pkg/active_tile.minified.js pkg/active_tile.js`
  `java -jar vendor/yuicompressor.jar --type js -o pkg/active_tile.compressed.js pkg/active_tile.js`
end
