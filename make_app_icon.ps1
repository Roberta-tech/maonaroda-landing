Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Caio\maonaroda-landing\logo.oficial.png"
$outPath = "C:\Users\rober\Desktop\Fotos_AppStore\Icone_AppStore_1024x1024.png"

$srcImage = [System.Drawing.Image]::FromFile($srcPath)
$destBitmap = New-Object System.Drawing.Bitmap(1024, 1024)
$graphics = [System.Drawing.Graphics]::FromImage($destBitmap)

$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

// Fill black background in case logo has transparent padding
$graphics.Clear([System.Drawing.Color]::Black)
$graphics.DrawImage($srcImage, 0, 0, 1024, 1024)

$destBitmap.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$destBitmap.Dispose()
$srcImage.Dispose()

Write-Host "Icon created successfully: $outPath"
