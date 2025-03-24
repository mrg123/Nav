document.addEventListener('DOMContentLoaded', () => {
  // 添加结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "个人网站导航系统",
    "description": "收藏整理常用新闻媒体、学习资源和财经资讯网站",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "新闻媒体导航",
      "学习资源导航",
      "财经资讯导航",
      "网站搜索功能",
      "数据导入导出"
    ]
  };

  // 将结构化数据添加到页面
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);

  // 网站数据存储
  let sitesData = {
    international: [
      { name: 'BBC中文网', url: 'https://www.bbc.com/zhongwen', description: '英国广播公司中文新闻', icon: '🌐' },
      { name: '彭博社', url: 'https://www.bloomberg.com/asia', description: '财经与全球商业新闻', icon: '🔶' },
      { name: '路透社中文', url: 'https://cn.reuters.com/', description: '国际新闻与时事', icon: '🌍' },
      { name: '纽约时报中文网', url: 'https://cn.nytimes.com/', description: '美国视角全球报道', icon: '🗽' }
    ],
    domestic: [
      { name: '观察者网', url: 'https://www.guancha.cn/', description: '中国视角国际分析', icon: '🔭' },
      { name: '澎湃新闻', url: 'https://www.thepaper.cn/', description: '时政与社会新闻', icon: '📱' },
      { name: '人民日报', url: 'http://www.people.com.cn/', description: '官方权威信息', icon: '🏛️' }
    ],
    finance: [
      { name: '财新网', url: 'https://www.caixin.com/', description: '深度财经报道', icon: '💹' },
      { name: '华尔街日报中文网', url: 'https://cn.wsj.com/', description: '全球金融市场动态', icon: '📈' },
      { name: '界面新闻', url: 'https://www.jiemian.com/', description: '财经商业资讯', icon: '💰' }
    ],
    learning: [
      { name: 'Coursera', url: 'https://www.coursera.org/', description: '全球名校在线课程', icon: '🎓' },
      { name: '中国大学MOOC', url: 'https://www.icourse163.org/', description: '国内高校精品课程', icon: '🧠' },
      { name: '知网', url: 'https://www.cnki.net/', description: '中国学术文献资源', icon: '📑' },
      { name: 'Google Scholar', url: 'https://scholar.google.com/', description: '学术论文搜索', icon: '🔬' }
    ]
  };
  
  // 从本地存储加载数据
  const loadData = () => {
    const savedData = localStorage.getItem('navSitesData');
    if (savedData) {
      sitesData = JSON.parse(savedData);
      renderSites();
    }
  };
  
  // 保存数据到本地存储
  const saveData = () => {
    localStorage.setItem('navSitesData', JSON.stringify(sitesData));
  };
  
  // 渲染所有网站
  const renderSites = () => {
    // 渲染快速访问区
    const quickCards = document.querySelector('.quick-cards');
    quickCards.innerHTML = '';
    
    // 收集所有网站并按使用频率排序（这里模拟）
    const allSites = [];
    Object.values(sitesData).forEach(category => {
      category.forEach(site => {
        allSites.push(site);
      });
    });
    
    // 选取前5个作为快速访问
    allSites.slice(0, 5).forEach(site => {
      const quickCard = document.createElement('a');
      quickCard.href = site.url;
      quickCard.className = 'quick-card';
      quickCard.target = '_blank';
      quickCard.innerHTML = `
        <div class="card-icon">${site.icon}</div>
        <div class="card-name">${site.name}</div>
      `;
      quickCards.appendChild(quickCard);
    });
    
    // 渲染分类区域
    const categories = {
      international: document.querySelector('.category:nth-child(1) .sites-grid'),
      domestic: document.querySelector('.category:nth-child(2) .sites-grid'),
      finance: document.querySelector('.category:nth-child(3) .sites-grid'),
      learning: document.querySelector('.category:nth-child(4) .sites-grid')
    };
    
    Object.keys(categories).forEach(key => {
      categories[key].innerHTML = '';
      sitesData[key].forEach(site => {
        const siteCard = document.createElement('a');
        siteCard.href = site.url;
        siteCard.className = 'site-card';
        siteCard.target = '_blank';
        siteCard.innerHTML = `
          <div class="site-icon">${site.icon}</div>
          <div class="site-info">
            <h3>${site.name}</h3>
            <p>${site.description}</p>
          </div>
          <div class="delete-btn" aria-label="删除网站">✗</div>
        `;
        
        // 添加删除按钮事件
        const deleteBtn = siteCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
          e.preventDefault(); // 阻止链接跳转
          e.stopPropagation(); // 阻止事件冒泡
          
          // 添加删除确认动画
          siteCard.style.animation = 'fadeOut 0.3s ease forwards';
          
          // 延迟删除，等待动画完成
          setTimeout(() => {
            // 从数据中删除
            const index = sitesData[key].findIndex(s => s.url === site.url);
            if (index !== -1) {
              sitesData[key].splice(index, 1);
              saveData();
              renderSites();
              enableCardTiltEffect();
            }
          }, 300);
        });
        
        categories[key].appendChild(siteCard);
      });
    });

    // 为每个网站添加结构化数据
    Object.values(sitesData).forEach(category => {
      category.forEach(site => {
        const siteStructuredData = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": site.name,
          "url": site.url,
          "description": site.description
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(siteStructuredData);
        document.head.appendChild(script);
      });
    });
  };
  
  // 分类折叠功能
  const categoryToggles = document.querySelectorAll('.category-toggle');
  categoryToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const category = toggle.closest('.category');
      const sitesGrid = category.querySelector('.sites-grid');
      
      if (sitesGrid.style.display === 'none') {
        sitesGrid.style.display = 'grid';
        toggle.textContent = '-';
        sitesGrid.style.animation = 'fadeIn 0.5s ease forwards';
      } else {
        sitesGrid.style.display = 'none';
        toggle.textContent = '+';
      }
    });
  });
  
  // 搜索功能
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const allSiteCards = document.querySelectorAll('.site-card');
    
    allSiteCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      
      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = 'flex';
        // 高亮匹配文本的动画效果
        card.style.boxShadow = '0 0 10px rgba(0, 238, 255, 0.5)';
        setTimeout(() => {
          card.style.boxShadow = 'none';
        }, 1000);
      } else {
        card.style.display = 'none';
      }
    });
  });
  
  // 主题切换功能
  const themeToggle = document.querySelector('.theme-toggle');
  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.body.classList.remove('light-theme');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  };

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLightTheme = document.body.classList.contains('light-theme');
    
    // 保存主题设置
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    
    // 更新图标
    themeToggle.innerHTML = isLightTheme ? 
      '<i class="fas fa-sun"></i>' : 
      '<i class="fas fa-moon"></i>';
  });
  
  // 初始化时加载保存的主题
  loadTheme();
  
  // 增强卡片悬停特效
  const enableCardTiltEffect = () => {
    const allCards = document.querySelectorAll('.site-card, .quick-card');
    allCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 增强3D倾斜效果
        const tiltX = (y / rect.height - 0.5) * 20;
        const tiltY = (x / rect.width - 0.5) * -20;
        
        // 添加缩放效果
        const scale = 1.05;
        
        // 添加阴影效果
        const shadowX = (x / rect.width - 0.5) * 20;
        const shadowY = (y / rect.height - 0.5) * 20;
        const shadowBlur = 20;
        
        card.style.transform = `
          perspective(1000px)
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
          scale(${scale})
          translateZ(20px)
        `;
        
        card.style.boxShadow = `
          ${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 238, 255, 0.3),
          ${-shadowX}px ${-shadowY}px ${shadowBlur}px rgba(0, 238, 255, 0.2)
        `;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  };
  
  // 模态框功能
  const modal = document.getElementById('add-site-modal');
  const addBtn = document.getElementById('add-site-btn');
  const closeModal = document.querySelector('.close-modal');
  const addSiteForm = document.getElementById('add-site-form');
  
  addBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });
  
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // 添加新网站
  addSiteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('site-name').value;
    const url = document.getElementById('site-url').value;
    const description = document.getElementById('site-description').value || '未添加描述';
    const category = document.getElementById('site-category').value;
    const icon = document.getElementById('site-icon').value || '🔗';
    
    const newSite = { name, url, description, icon };
    sitesData[category].push(newSite);
    
    saveData();
    renderSites();
    enableCardTiltEffect();
    
    modal.style.display = 'none';
    addSiteForm.reset();
  });
  
  // 导出数据
  document.getElementById('export-data').addEventListener('click', (e) => {
    e.preventDefault();
    const dataStr = JSON.stringify(sitesData);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'my_nav_data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  });
  
  // 导入数据
  document.getElementById('import-data').addEventListener('click', (e) => {
    e.preventDefault();
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          sitesData = importedData;
          saveData();
          renderSites();
          enableCardTiltEffect();
          alert('数据导入成功！');
        } catch (error) {
          alert('导入失败，文件格式错误');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  });
  
  // 添加删除动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
      }
    }
  `;
  document.head.appendChild(style);
  
  // 初始化
  loadData();
  enableCardTiltEffect();
}); 