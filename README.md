# bc-generator

CSVファイルを読み込み、複数名の名刺データを一括で作成します。<br>
市販の名刺シート（ミシン目で10枚単位になっているもの）向けのPDFデータをIllustrator や InDesign 、 Word などに依存せず、 Node.js と Chrome が動作する環境ならどこでも走ります。

## しくみ

1. 名刺のテンプレートとなるHTMLと、名簿となるCSVを読み込みます。 
2. CSVのデータを基に、各個人のHTMLを作成します。
3. Google Chrome (Headless Mode) でそれらのHTMLをPDF出力します

## How to use

### インストール

```
npm install -g bc-generator
```


### 生成

適当なディレクトリを作成し、テンプレートディレクトリをここに放り込みます。テンプレートディレクトリの名前がテンプレート名になります。

```
some directory
 |- テンプレート名
 |   |- css
 |    |   |-CSSファイル
 |    |- img
 |    |   |-画像ファイル
 |    |-A4.html（テンプレートファイル）
 |
 |-PDFファイル
```

コマンドを叩きます

```
bcgen --csv addressbook.csv --template basic --size A4
```

PDFファイルが生成されます。