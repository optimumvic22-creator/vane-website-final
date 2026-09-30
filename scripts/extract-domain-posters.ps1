# Windows Shell thumbnails from the existing, locally encoded MP4 sources.
param([string]$MediaDirectory = (Join-Path $PSScriptRoot '../public/media/mqs-domains'))
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class DomainPoster {
  [StructLayout(LayoutKind.Sequential)] public struct Size { public int cx, cy; }
  [ComImport, Guid("bcc18b79-ba16-442f-80c4-8a59c30c463b"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  interface ImageFactory { [PreserveSig] int GetImage(Size size, int flags, out IntPtr bitmap); }
  [DllImport("shell32.dll", CharSet=CharSet.Unicode, PreserveSig=false)]
  static extern void SHCreateItemFromParsingName(string path, IntPtr context, ref Guid iid, [MarshalAs(UnmanagedType.Interface)] out ImageFactory factory);
  [DllImport("gdi32.dll")] static extern bool DeleteObject(IntPtr handle);
  public static void Save(string source, string target) {
    Guid iid = new Guid("bcc18b79-ba16-442f-80c4-8a59c30c463b");
    ImageFactory factory; SHCreateItemFromParsingName(source, IntPtr.Zero, ref iid, out factory);
    IntPtr bitmap = IntPtr.Zero;
    try {
      Marshal.ThrowExceptionForHR(factory.GetImage(new Size { cx=480, cy=480 }, 9, out bitmap));
      using (var image = Image.FromHbitmap(bitmap)) image.Save(target, ImageFormat.Jpeg);
    } finally { if(bitmap != IntPtr.Zero) DeleteObject(bitmap); Marshal.ReleaseComObject(factory); }
  }
}
'@
Get-ChildItem -LiteralPath (Resolve-Path -LiteralPath $MediaDirectory).Path -Filter '*-web.mp4' | ForEach-Object {
  $target = Join-Path $_.DirectoryName ($_.BaseName.Replace('-web', '-poster') + '.jpg')
  [DomainPoster]::Save($_.FullName, $target)
  Get-Item -LiteralPath $target | Select-Object Name, Length
}
