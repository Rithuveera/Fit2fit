import ngrok from 'ngrok';

(async function () {
    try {
        console.log('🚀 Starting ngrok tunnel...\n');

        const url = await ngrok.connect({
            proto: 'http',
            addr: 3000,
            authtoken: '35zxB1atqdaorRY3KiWaYx22Rd7_7setWmm951Q9qEoDnjwEG'
        });

        console.log('========================================');
        console.log('  ✅ NGROK TUNNEL ACTIVE!');
        console.log('========================================\n');
        console.log('🌐 Your Public URL:');
        console.log('   ' + url);
        console.log('\n========================================');
        console.log('📊 ngrok Web Interface:');
        console.log('   http://127.0.0.1:4040');
        console.log('========================================\n');
        console.log('✅ Your gym app is now publicly accessible!');
        console.log('📱 Share this URL with anyone worldwide\n');
        console.log('⚠️  Keep this terminal open to maintain the tunnel');
        console.log('⏹️  Press Ctrl+C to stop the tunnel\n');

        // Keep the process running
        process.on('SIGINT', async () => {
            console.log('\n\n🛑 Stopping ngrok tunnel...');
            await ngrok.disconnect();
            await ngrok.kill();
            console.log('✅ Tunnel stopped');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error starting ngrok:', error.message);
        process.exit(1);
    }
})();
