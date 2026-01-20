/*
ローディング画面
================================================ */

// ローディング中はスクロール禁止
document.body.classList.add('noscroll');  // classListでclass属性を操作

window.addEventListener('load', () => {

  // プログレスバーの初期化
  var bar = new ProgressBar.Path('#heart-path', {
    easing: 'easeInOut',
    duration: 2000
  });

  bar.set(0);
  bar.animate(1.0);

  // プログレスバーをフェードアウト
  const progressbar = document.querySelector('#progressbar');
  progressbar.animate(
    {
      opacity: [1, 0],        //不透明度を1から0へ
    },
    {
      duration: 600,
      delay: 1000,
      fill: 'forwards',
    }
  )

  // ローディングスクリーンを移動
  const loadingScreen = document.querySelector('#loading-screen');
  loadingScreen.animate(
    {
      translate: ['0 100vh', '0 0', '0 -100vh'],  //下から中央、上へ移動
      opacity: [1, 0]
    },
    {
      duration: 2000,
      delay: 800,
      easing: 'ease',
      fill: 'forwards',
    }
  );

  // ローディング全体をフェードアウト
  const loadingArea = document.querySelector('#loading');
  loadingArea.animate(
    {
      opacity: [1, 0],        //不透明度を1から0へ
      visibility: 'hidden',   //非表示にする
    },
    {
      duration: 2000,
      delay: 1000,            //1秒遅延させる
      easing: 'ease',         //開始時と終了時は緩やかに変化
      fill: 'forwards',       //アニメーション後の状態を維持
    }
  );

  // スクロール禁止を解除
    setTimeout(() => {
    document.body.classList.remove('noscroll'); }, 2000);       // アニメーション終了に合わせて調整

});

/*
トップページ
================================================ */
const bgVideo = document.querySelector('#bg-video');
const overlay = document.querySelector('.overlay'); // overlay要素を取得

if (bgVideo) {
  // video の再生が終わったらフェードアウトして非表示にする
  bgVideo.addEventListener('ended', () => {
    // 背景色を薄茶色に変更
    document.body.style.backgroundColor = 'var(--light-brown)';

        // overlay要素を削除
    //if (overlay) {
      overlay.remove();
    //}


    bgVideo.animate(
      { opacity: [1, 0] },                                      // 不透明度を1から0へ。これだけでもいいが、要素は残る
      { duration: 800, fill: 'forwards' }
      );
    setTimeout(() => { 
      bgVideo.style.display = 'none';
      
     }, 700); // 要素を完全に消去
  });
}

/*
プロフィールページ
================================================ */
const profileItems = document.querySelectorAll('#profile-list li');
profileItems.forEach(item => {
  item.addEventListener('mouseover', () => {
    item.animate(
      { transform: ['translateY(0)', 'translateY(-10px)', 'translateY(0)'] },
      { duration: 600, easing: 'ease-out' }
    );
  });
});