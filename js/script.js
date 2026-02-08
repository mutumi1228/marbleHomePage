/*
COMMON JS
================================================ */
// スクロール惰性効果
let isScrolling       = false;   // スクロール中かどうかのフラグ
let scrollVelocity    = 0;       // スクロール量
let lastScrollTop     = 0;       // 最後のスクロール位置
let isLoading         = true;    // ローディング中かどうかのフラグ

window.addEventListener('wheel', (e) => {
  // ローディング中はスクロール処理をスキップ
  if (isLoading) {
    e.preventDefault();
    return;
  }
  
  console.log(e);                   // eにはイベント発生時の詳細情報が含まれる
  scrollVelocity = e.deltaY * 0.2;  // スクロール量を保存
  isScrolling = true;
  }, 
  { passive: false }                // preventDefaultを使用するため、passiveをfalseに設定
);

function applyMomentumScroll() {
  if (isScrolling && !isLoading) {
    window.scrollBy(0, scrollVelocity);   //　下に scrollVelocity(px)分スクロール
    scrollVelocity *= 0.9;                // スクロール量をを90%に減速（0.9〜0.98で調整）
    
    if (Math.abs(scrollVelocity) < 0.2) {  // 速度が小さくなったら終了
      isScrolling = false;
    } else {
      requestAnimationFrame(applyMomentumScroll);
    }
  }
}

window.addEventListener('wheel', () => {
  if (!isLoading) {
    requestAnimationFrame(applyMomentumScroll);
  }
}, { passive: false });

/*
ローディング画面
================================================ */

// スクロール・タッチを禁止する関数
function disableScroll() {
  isLoading = true;
  document.body.classList.add('noscroll');
  
  // wheelイベントの無効化
  window.addEventListener('wheel', preventScroll, { passive: false });
  
  // タッチイベントの無効化
  window.addEventListener('touchmove', preventScroll, { passive: false });
}

// スクロール・タッチ禁止を解除する関数
function enableScroll() {
  isLoading = false;
  document.body.classList.remove('noscroll');
  
  // イベントリスナーを削除
  window.removeEventListener('wheel', preventScroll);
  window.removeEventListener('touchmove', preventScroll);
}

// スクロール防止関数
function preventScroll(e) {
  if (isLoading) {
    e.preventDefault();
  }
}

// ページロード時の初期設定
disableScroll();

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
    enableScroll();
  }, 2800);       // アニメーション終了に合わせて調整

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
    //document.body.style.backgroundColor = 'var(--light-brown)';

        // overlay要素を削除
    //if (overlay) {
      //overlay.remove();
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
const profile = document.querySelector('.profile');
const profileTitle = document.querySelector('.profile-title');

window.addEventListener('load', () => {
  setTimeout(() => {
    profileTitle.animate(
    );
  }, 2000);
});


profileItems.forEach(item => {
  // 初期状態で非表示
  item.style.opacity = '0';
  
  item.addEventListener('mouseover', () => {
    item.animate(
      { transform: ['translateY(0)', 'translateY(-10px)', 'translateY(0)'] },
      { duration: 600, easing: 'ease-out' }
    );
  });
});

// 監視対象が範囲内に表れたらアニメーションを実行
const showProfileCard = (entries) => {
  const keyframes = {
    opacity: [0, 1],
    translate: ['0 100px', '0 0'],
  };
  entries.forEach((entry, i) => {       // 第一引数は監視対象、第二引数は要素番号
    // 見える時だけアニメーション実行
    if (entry.isIntersecting) {
      console.log(entry.target);
      entry.target.animate(keyframes, { 
        duration: 1200, 
        easing: 'ease-out',
        fill: 'forwards' ,
        delay: i * 200
      });
      // アニメーション後は監視を解除（二度と実行されない）
      profileObserver.unobserve(entry.target);
    }
  });
};
// 監視ロボットの設定
const profileObserver = new IntersectionObserver(showProfileCard);

// 監視ロボットにプロフィールカードを監視させる（ローディング終了後）
window.addEventListener('load', () => {
  setTimeout(() => {                    //指定した時間（ミリ秒単位）が経過した後、一度だけ関数を実行する
    profileItems.forEach(card => {
      profileObserver.observe(card);    //ovserveは一つの要素しか受け付けないためforEach使用
    });
  }, 2000);
});

/*
写真ギャラリー
================================================ */
// 写真要素の取得
const photoImages = document.querySelectorAll('.photo img');
const mainPhoto = document.querySelector('.bigPhoto img');
const photoThumbnails = document.querySelectorAll('.photo-slider img');

// 写真要素の初期状態を設定（opacity: 0）
photoImages.forEach(img => {
  img.style.opacity = '0';
});

// 監視対象が範囲内に表れたらアニメーションを実行
const showpicture = (entries) => {
  const keyframes = {
    opacity: [0, 1],
    translate: ['0 100px', '0 0'],
  };
  entries.forEach((entry, i) => {       // 第一引数は監視対象、第二引数は要素番号
    // 見える時だけアニメーション実行
    if (entry.isIntersecting) {
      console.log(entry.target);
      entry.target.animate(keyframes, { 
        duration: 1200, 
        easing: 'ease-out',
        fill: 'forwards' ,
      });
      // アニメーション後は監視を解除（二度と実行されない）
      pictureObserver.unobserve(entry.target);
    }
  });
};
// 監視ロボットの設定
const pictureObserver = new IntersectionObserver(showpicture);

// 監視ロボットに写真を監視させる（ローディング終了後）
window.addEventListener('load', () => {
  setTimeout(() => {                    //指定した時間（ミリ秒単位）が経過した後、一度だけ関数を実行する
    photoImages.forEach(img => {
      pictureObserver.observe(img);
    });
  }, 2000);
});

photoThumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener('mouseover', () => {
    mainPhoto.src = thumbnail.src;
    mainPhoto.animate({opacity: [0, 1]}, {duration: 500}); // アニメーション追加
  });
});