Add-Type -AssemblyName System.Drawing

function New-Icon {
  param([int]$Size, [string]$Out)

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $k = $Size / 512.0

  $g.Clear([System.Drawing.Color]::FromArgb(255, 16, 20, 28))

  $ring = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(40, 74, 222, 128)), (18 * $k)
  $rp = New-Object System.Drawing.RectangleF (24 * $k), (24 * $k), (464 * $k), (464 * $k)
  $g.DrawArc($ring, $rp, 45, 270)

  $rect = New-Object System.Drawing.RectangleF (212 * $k), (112 * $k), (88 * $k), (180 * $k)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddArc($rect.X, $rect.Y, $rect.Width, $rect.Width, 180, 180)
  $path.AddArc($rect.X, $rect.Bottom - $rect.Width, $rect.Width, $rect.Width, 0, 180)
  $path.CloseFigure()
  $green = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 74, 222, 128))
  $g.FillPath($green, $path)

  $arcPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 74, 222, 128)), (34 * $k)
  $arcPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $arcPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $g.DrawArc($arcPen, (148 * $k), (146 * $k), (216 * $k), (216 * $k), 20, 140)

  $g.FillRectangle($green, (239 * $k), (330 * $k), (34 * $k), (72 * $k))
  $g.FillRectangle($green, (176 * $k), (392 * $k), (160 * $k), (26 * $k))

  $cyan = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(215, 34, 211, 238))
  $g.FillRectangle($cyan, (94 * $k), (224 * $k), (22 * $k), (52 * $k))
  $g.FillRectangle($cyan, (396 * $k), (224 * $k), (22 * $k), (52 * $k))

  $g.Dispose()
  $bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "wrote $Out"
}

$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
New-Icon -Size 192 -Out (Join-Path $dir "icon-192.png")
New-Icon -Size 512 -Out (Join-Path $dir "icon-512.png")
