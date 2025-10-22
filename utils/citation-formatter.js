/**
 * 引用格式生成器
 * 支持6种常用引用格式
 */

/**
 * 格式化作者名（用于不同引用格式）
 */
function formatAuthors(authors, format = 'full', maxAuthors = null) {
  if (!authors || authors.length === 0) {
    return 'Unknown Author';
  }

  let formattedAuthors = [];

  authors.forEach((author, index) => {
    const given = author.given || '';
    const family = author.family || author.name || '';

    if (!family) return;

    switch (format) {
      case 'full': // 全名：John Doe
        formattedAuthors.push(`${given} ${family}`.trim());
        break;
      case 'last-first': // 姓，名首字母：Doe, J.
        const initials = given.split(' ').map(n => n.charAt(0).toUpperCase()).join('. ');
        formattedAuthors.push(`${family}, ${initials}${initials ? '.' : ''}`);
        break;
      case 'last-first-full': // 姓，全名：Doe, John
        formattedAuthors.push(`${family}, ${given}`.trim());
        break;
      case 'chinese': // 中文格式：姓名
        formattedAuthors.push(`${family} ${given}`.trim());
        break;
      default:
        formattedAuthors.push(`${given} ${family}`.trim());
    }
  });

  // 限制作者数量
  if (maxAuthors && formattedAuthors.length > maxAuthors) {
    formattedAuthors = formattedAuthors.slice(0, maxAuthors);
    formattedAuthors.push('et al.');
  }

  return formattedAuthors;
}

/**
 * GB/T 7714-2015 中文国标格式
 */
function formatGBT7714(metadata) {
  const authors = formatAuthors(metadata.authors, 'chinese', 3);
  const authorStr = authors.join(', ');
  
  const title = metadata.title;
  const journal = metadata.journal;
  const year = metadata.year || '';
  const volume = metadata.volume || '';
  const issue = metadata.issue || '';
  const pages = metadata.pages || '';
  
  let citation = `${authorStr}. ${title}[J]. ${journal}`;
  
  if (year) {
    citation += `, ${year}`;
  }
  
  if (volume) {
    citation += `, ${volume}`;
    if (issue) {
      citation += `(${issue})`;
    }
  }
  
  if (pages) {
    citation += `: ${pages}`;
  }
  
  citation += '.';
  
  if (metadata.doi) {
    citation += ` DOI: ${metadata.doi}`;
  }
  
  return citation;
}

/**
 * ACS Style (American Chemical Society)
 */
function formatACS(metadata) {
  const authors = formatAuthors(metadata.authors, 'last-first', null);
  let authorStr;
  
  if (authors.length === 1) {
    authorStr = authors[0];
  } else if (authors.length === 2) {
    authorStr = authors.join('; ');
  } else {
    authorStr = authors.slice(0, -1).join('; ') + '; ' + authors[authors.length - 1];
  }
  
  const title = metadata.title;
  const journal = metadata.journalShort || metadata.journal;
  const year = metadata.year || '';
  const volume = metadata.volume || '';
  const pages = metadata.pages || '';
  
  let citation = `${authorStr} ${title}. `;
  
  if (journal) {
    citation += `${journal} `;
  }
  
  if (year) {
    citation += `${year}`;
  }
  
  if (volume) {
    citation += `, ${volume}`;
  }
  
  if (pages) {
    citation += `, ${pages}`;
  }
  
  citation += '.';
  
  return citation;
}

/**
 * Nature Style
 */
function formatNature(metadata) {
  const authors = formatAuthors(metadata.authors, 'last-first', null);
  let authorStr;
  
  if (authors.length === 1) {
    authorStr = authors[0];
  } else if (authors.length === 2) {
    authorStr = authors.join(' & ');
  } else {
    authorStr = authors.slice(0, -1).join(', ') + ' & ' + authors[authors.length - 1];
  }
  
  const title = metadata.title;
  const journal = metadata.journal;
  const year = metadata.year || '';
  const volume = metadata.volume || '';
  const pages = metadata.pages || '';
  
  let citation = `${authorStr} ${title}. `;
  
  if (journal) {
    citation += `${journal} `;
  }
  
  if (volume) {
    citation += `${volume}`;
  }
  
  if (pages) {
    citation += `, ${pages}`;
  }
  
  if (year) {
    citation += ` (${year})`;
  }
  
  citation += '.';
  
  return citation;
}

/**
 * APA 7th Edition
 */
function formatAPA(metadata) {
  const authors = formatAuthors(metadata.authors, 'last-first', null);
  let authorStr;
  
  if (authors.length === 1) {
    authorStr = authors[0];
  } else if (authors.length <= 20) {
    authorStr = authors.slice(0, -1).join(', ') + ', & ' + authors[authors.length - 1];
  } else {
    // 超过20个作者，列出前19个，然后省略号，最后一个
    authorStr = authors.slice(0, 19).join(', ') + ', ... ' + authors[authors.length - 1];
  }
  
  const title = metadata.title;
  const journal = metadata.journal;
  const year = metadata.year || 'n.d.';
  const volume = metadata.volume || '';
  const issue = metadata.issue || '';
  const pages = metadata.pages || '';
  
  let citation = `${authorStr} (${year}). ${title}. `;
  
  if (journal) {
    citation += `${journal}`;
  }
  
  if (volume) {
    citation += `, ${volume}`;
    if (issue) {
      citation += `(${issue})`;
    }
  }
  
  if (pages) {
    citation += `, ${pages}`;
  }
  
  citation += '.';
  
  if (metadata.doi) {
    citation += ` https://doi.org/${metadata.doi}`;
  }
  
  return citation;
}

/**
 * BibTeX格式
 */
function formatBibTeX(metadata) {
  // 生成citation key: 第一作者姓氏+年份
  let citationKey = 'unknown';
  if (metadata.authors && metadata.authors.length > 0) {
    const firstAuthor = metadata.authors[0];
    const lastName = (firstAuthor.family || firstAuthor.name || 'unknown').toLowerCase().replace(/[^a-z]/g, '');
    citationKey = `${lastName}${metadata.year || ''}`;
  }
  
  // 格式化作者名
  const authors = formatAuthors(metadata.authors, 'last-first-full', null);
  const authorStr = authors.join(' and ');
  
  let bibtex = `@article{${citationKey},\n`;
  bibtex += `  author = {${authorStr}},\n`;
  bibtex += `  title = {${metadata.title}},\n`;
  
  if (metadata.journal) {
    bibtex += `  journal = {${metadata.journal}},\n`;
  }
  
  if (metadata.year) {
    bibtex += `  year = {${metadata.year}},\n`;
  }
  
  if (metadata.volume) {
    bibtex += `  volume = {${metadata.volume}},\n`;
  }
  
  if (metadata.issue) {
    bibtex += `  number = {${metadata.issue}},\n`;
  }
  
  if (metadata.pages) {
    bibtex += `  pages = {${metadata.pages}},\n`;
  }
  
  if (metadata.doi) {
    bibtex += `  doi = {${metadata.doi}},\n`;
  }
  
  if (metadata.url) {
    bibtex += `  url = {${metadata.url}},\n`;
  }
  
  if (metadata.publisher) {
    bibtex += `  publisher = {${metadata.publisher}},\n`;
  }
  
  bibtex += `}`;
  
  return bibtex;
}

/**
 * EndNote格式（RIS）
 */
function formatEndNote(metadata) {
  let ris = 'TY  - JOUR\n'; // Journal article
  
  // 作者
  if (metadata.authors && metadata.authors.length > 0) {
    metadata.authors.forEach(author => {
      const family = author.family || author.name || '';
      const given = author.given || '';
      if (family) {
        ris += `AU  - ${family}, ${given}\n`;
      }
    });
  }
  
  // 标题
  if (metadata.title) {
    ris += `TI  - ${metadata.title}\n`;
  }
  
  // 期刊
  if (metadata.journal) {
    ris += `JO  - ${metadata.journal}\n`;
  }
  
  if (metadata.journalShort) {
    ris += `JA  - ${metadata.journalShort}\n`;
  }
  
  // 年份
  if (metadata.year) {
    let date = `${metadata.year}`;
    if (metadata.month) {
      date += `/${metadata.month.toString().padStart(2, '0')}`;
      if (metadata.day) {
        date += `/${metadata.day.toString().padStart(2, '0')}`;
      }
    }
    ris += `PY  - ${date}\n`;
  }
  
  // 卷期页
  if (metadata.volume) {
    ris += `VL  - ${metadata.volume}\n`;
  }
  
  if (metadata.issue) {
    ris += `IS  - ${metadata.issue}\n`;
  }
  
  if (metadata.pages) {
    ris += `SP  - ${metadata.pages.split('-')[0]}\n`;
    if (metadata.pages.includes('-')) {
      ris += `EP  - ${metadata.pages.split('-')[1]}\n`;
    }
  }
  
  // DOI和URL
  if (metadata.doi) {
    ris += `DO  - ${metadata.doi}\n`;
  }
  
  if (metadata.url) {
    ris += `UR  - ${metadata.url}\n`;
  }
  
  // 出版商
  if (metadata.publisher) {
    ris += `PB  - ${metadata.publisher}\n`;
  }
  
  ris += 'ER  - \n';
  
  return ris;
}

/**
 * 格式化引用
 * @param {Object} metadata - 文献元数据
 * @param {string} format - 引用格式（gbt7714, acs, nature, apa, bibtex, endnote）
 * @returns {string} 格式化后的引用
 */
function formatCitation(metadata, format) {
  if (!metadata) {
    return '';
  }

  switch (format.toLowerCase()) {
    case 'gbt7714':
    case 'gb':
      return formatGBT7714(metadata);
    case 'acs':
      return formatACS(metadata);
    case 'nature':
      return formatNature(metadata);
    case 'apa':
      return formatAPA(metadata);
    case 'bibtex':
      return formatBibTeX(metadata);
    case 'endnote':
    case 'ris':
      return formatEndNote(metadata);
    default:
      return formatACS(metadata); // 默认使用ACS格式
  }
}

/**
 * 获取所有支持的格式
 */
function getSupportedFormats() {
  return [
    { id: 'gbt7714', name: 'GB/T 7714-2015', description: '中文国家标准' },
    { id: 'acs', name: 'ACS Style', description: '美国化学会' },
    { id: 'nature', name: 'Nature', description: 'Nature期刊' },
    { id: 'apa', name: 'APA 7th', description: 'APA第7版' },
    { id: 'bibtex', name: 'BibTeX', description: 'LaTeX引用' },
    { id: 'endnote', name: 'EndNote (RIS)', description: 'EndNote格式' }
  ];
}

module.exports = {
  formatCitation,
  formatAuthors,
  getSupportedFormats,
  // 导出单独的格式化函数（可选）
  formatGBT7714,
  formatACS,
  formatNature,
  formatAPA,
  formatBibTeX,
  formatEndNote
};

