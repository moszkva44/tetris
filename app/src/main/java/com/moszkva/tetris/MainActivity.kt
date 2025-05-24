package com.moszkva.tetris

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.moszkva.tetris.ui.theme.TetrisTheme


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TetrisTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    val myWebView = WebView(this)
                    setContentView(myWebView)
                    renderPage(
                        myWebView = myWebView
                    )
                }
            }
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
fun renderPage(myWebView: WebView) {
    myWebView.setInitialScale(1);
    myWebView.settings.javaScriptEnabled = true
    myWebView.settings.domStorageEnabled = true;
    //myWebView.settings.loadWithOverviewMode = true;
    myWebView.settings.useWideViewPort = true;

    myWebView.loadUrl("file:///android_asset/index.html");
}
