Add-Type -AssemblyName System.Drawing

$dirs = @("assets/sources", "public/assets/sources")

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        Write-Host "Directory $dir not found. Skipping."
        continue
    }

    Write-Host "Processing directory: $dir"
    
    Get-ChildItem $dir -Filter *.jpg -Recurse | ForEach-Object {
        $file = $_.FullName
        try {
            $img = [System.Drawing.Image]::FromFile($file)
            $size = (Get-Item $file).Length
            
            # Target images that are wider than 1000px or larger than 250KB for compression/resize
            if ($img.Width -gt 1000 -or $size -gt 250KB) {
                Write-Host "Optimising $($_.Name) in $dir (Width: $($img.Width)px, Size: $([Math]::Round($size / 1MB, 2)) MB)..."
                
                # Calculate new dimensions (max width 1000px)
                $newWidth = 1000
                if ($img.Width -lt 1000) {
                    $newWidth = $img.Width
                }
                $newHeight = [int]($img.Height * ($newWidth / $img.Width))
                
                # Create resized bitmap
                $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
                $g = [System.Drawing.Graphics]::FromImage($bmp)
                $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $g.DrawImage($img, 0, 0, $newWidth, $newHeight)
                $g.Dispose()
                $img.Dispose()
                
                # Set up JPEG Quality 80 Encoder
                $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
                $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
                $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 80)
                
                # Save and overwrite original
                $bmp.Save($file, $jpegCodec, $encoderParams)
                $bmp.Dispose()
                
                $newSize = (Get-Item $file).Length
                Write-Host "  Success! New size: $([Math]::Round($newSize / 1KB, 1)) KB (Reduced by $([Math]::Round((1 - ($newSize / $size)) * 100, 1))%)"
            } else {
                $img.Dispose()
            }
        } catch {
            Write-Host "Error processing $($_.Name) in $dir - $_"
        }
    }
}
