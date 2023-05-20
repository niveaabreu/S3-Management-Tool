# Ferramenta de Gerenciamento do Amazon S3

Esta é uma ferramenta/produto de gerenciamento de buckets S3, instancias de armazenamento, com templates terraform tipo como se fosse um "google drive". 

Com esta ferramenta, será  possível criar-se novos buckets no S3, gerenciar suas permissões de acesso, criação de folders, criação de políticas. Será possível também a listagem de buckets na conta do usuários, objetos em um bucket especificado, configurações de lifecycle. 

Por fim, pretende-se a criação de uma simples interface web que possibilite o upload de objetos no bucket, assim como listagem,  download e exclusão destes caso seja do desejo do usuário. Notificação para saber qual bucket foi modificado.
<div align="center">
<img  style="width:500px" src="../assets/management.png"/>
</div>
## Pré requisitos
Para execução adequada deste roteiro, são necessários os seguintes pré-requisitos:

* Ubuntu > 20.0 ou WSL2
* Terraform
* Python > 3.6
* Conta na AWS com usuário com permissões de administrador

## Recursos essenciais da ferramenta

### AWS

É uma plataforma de serviços de computação em nuvem oferecida pela Amazon, que permite que indivíduos e organizações implementem aplicativos, serviços e infraestrutura na nuvem. A AWS oferece uma ampla variedade de serviços em nuvem, incluindo computação, armazentamento, banco de dados, análise, inteligência artificial, machine learning e muito mais.

Para conseguir interagir com os serviços e funções que a AWS provém, por meio de IaC (Infrastructure as Code), é necessário obter [chaves de acesso](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html), que permitam o gerenciamento e provisionamento dos recursos que desejamos alocar na nuvem.

De posse de suas respectivas chaves de acesso, crie duas variáveis de ambiente, conforme padrão abaixo:

```bash
export AWS_ACCESS_KEY_ID=<ID_CHAVE_DE_ACESSO>
export AWS_SECRET_ACCESS_KEY=<CHAVE_SECRETA_DE_ACESSO>

```
Realiza-se o acesso a essas chaves para segurança de dados de quem acessa, pois assim evita-se sempre ter que colocar a senha no ambiente e a senha estar exposta

### S3

É um serviço de armanezamento de objetos oferecido pela Amazon Web Services (AWS). O S3 permite que os usuários armazenem e recuperem arquivos de qualquer lugar da web.
O S3 é amplamente utilizado por empresas e organizações de diferentes setores para armazenamento e compartilhamento de arquivos, backup e arquivamento de dados, hospedagem de sites e aplicativos, e muito mais.

### Bucket

Bucket é um conceito de armazenamento usado em serviços de armazenamento em nuvem, como o Amazon S3. Um bucket pode ser considerado como um contêiner de objetos, que pode armazenar e gerenciar vários objetos, como arquivos, imagens, vídeos, entre outros. Os buckets são amplamente utilizados para hospedar sites estáticos, armazenamento de backup, arquivamento de dados e muito mais. Eles são uma parte essencial de muitos serviços em nuvem e permitem que os usuários armazenem, gerenciem e acessem dados de qualquer lugar da web.


### Terraform
 
 É uma infraestrutura que descreve os recursos que você deseja provisionar, como servidores, banco de dados e outros. Além disso, você pode usar o Terraform para criar, alterar e destruir recursos automaticamente.

 
 
### S3 Events

O Amazon S3 Events permite que você monitore alterações em seu bucket do Amazon S3 e responda essas alterações executando ações automáticas. Quando um evento ocorre em seu bucket como upload de um arquivo ou a exclusão de um objeto o S3 Events pode acusar uma ação automática como a invocação de uma função AWS Lambda ou a notificação de um tópico do Amazon Simple Notificacion Service (SNS).

### Função AWS Lambda

As Funções AWS Lambda fazem o processamento de eventos em tempo real como logs e notificações. Por exemplo, você pode criar uma função lambda que é acionada sempre que um novo objeto é enviado para um bucket do Amazon S3. A função pode processar o objeto, extrair informações relevantes, executar transformações ou armazenar dados em outros serviço. 


### Amazon Simple Notification Service (SNS)

O SNS é um serviço de mensagens e notificação da AWS que permite enviar mensagens para diferentes tipos de endpoints como emails, mensagens de texto(SMS), URLs entre outros. Além disso, você pode configurar o acesso para quem pode publicar e para quem pode se inscrever no tópico.

### CloudWatch Alarm

O CloudWatch Alarm é um serviço de monitoramento e observabilidade da AWS. O CloudWatch Alarm permite monitorar métricas específicas e acionar ações automáticas com base em condições predefinidas.


## Iniciando nossa infraestrutura

Crie uma pasta para organizar nossos arquivos chamada **terraform/**::

```bash
mkdir terraform 
cd terraform
```

Como nosso primeiro objetivo é criar um bucket na AWS crie um template chamado **s3.tf** com o seguinte conteúdo:

```terraform title="s3.tf"
#Provider and default region used
provider "aws" {
  region     = "us-east-2"
}

resource "aws_s3_bucket" "exemplo" {
  bucket = "<Nome do bucket>"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}
```

:warning: **Subistitua o nome do bucket pelo que você deseja, lembrando que esse nome é único em toda AWS**

Inicie então os recursos terraform necessários para provisionar rodando o comando abaixo:


```bash
terraform init
```

Agora veremos o plano de criação desses recursos:

```bash 
terraform plan
```

Por fim, realize deploy deste recurso na nuvem:

```bash
terraform apply -auto-approve
```

Caso tudo dê certo você verá isso no console da AWS


<div align="center">
<img  style="width:500px" src="../assets/bucket-nivea.png"/>
</div>


## Como subir um site estático por Terraform

Agora que já conseguimos subir um bucket privado de uso geral, podemos também modificar nossa infraestrutura para provisionar buckets que disponibilizem páginas estáticas, conforme nosso plano de infraestrutura.
Para isso, devemos...

* Fazer um provedor de nuvem da AWS
* Especificar o recurso que se quer criar : um bucket
* Define-se os controles do bucket
* Definir os acesso publico pra tirar esse bloqueio do 
* Definir qual o acesso do bucket
* Definir uma nova configuração de bucket
* Política de acesso a leitura do bucket
* Configurações e buckets de indexar pagina 


```terraform title="s3.tf"
provider "aws" {
  region = "us-east-1" # Substitua pela região desejada
}

resource "aws_s3_bucket" "website" {
  bucket = "bucketdanivinhaprojeto21"
}

resource "aws_s3_bucket_ownership_controls" "example" {
  bucket = aws_s3_bucket.website.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "example" {
  depends_on = [
    aws_s3_bucket_ownership_controls.example,
    aws_s3_bucket_public_access_block.example,
  ]

  bucket = aws_s3_bucket.website.id
  acl    = "public-read"
}

resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website.id
  versioning_configuration {
    status = "Enabled"
  }
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket_policy" "public_read_access" {
  bucket = aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.public_read_access.json
}

data "aws_iam_policy_document" "public_read_access" {
  statement {
    principals {
	  type = "*"
	  identifiers = ["*"]
	}

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.website.arn,
      "${aws_s3_bucket.website.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.bucket

  index_document {
    suffix = "index.html"
  }

}

resource "aws_s3_object" "index_page" {
  bucket       = aws_s3_bucket.website.id
  key          = "index.html"
  content_type = "text/html; charset=UTF-8"
  source       = "index.html"
} 
```

Na mesma pasta crie um arquivo chamado **index.html** e coloque o seguinte conteúdo nele:

```html 
<h1>Hello World</h1>
```

Inicie então os recursos terraform necessários para provisionar rodando o comando abaixo:


```bash
terraform init
```

Agora veremos o plano de criação desses recursos:

```bash 
terraform plan
```

Por fim, realize deploy deste recurso na nuvem:

```bash
terraform apply -auto-approve
```

Caso tudo dê certo você verá isso no console da AWS

<div align="center">
<img  style="width:500px" src="../assets/index2.png"/>
</div>

E a pagina você verá isso
<div align="center">
<img  style="width:500px" src="../assets/index3.png"/>
</div>

Fica disponibilizado o link em que você pode verificar:

```html 
http://bucketdanivinhaprojeto21.s3-website-us-east-1.amazonaws.com
```


## Como subir uma notificação SNS Terraform

Crie uma pasta no terraform chamada sns e dentro da pasta crie um arquivo **sns.tf** 

``` 
resource "aws_sns_topic" "example_topic" {
  name = "example-topic"
}

variable "email_subscription" {
  type    = string
  default = "niveaadl@al.insper.edu.br" # Insira o endereço de e-mail para sobregravação aqui
}

resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.example_topic.arn
  protocol  = "email"
  endpoint  = var.email_subscription
}

output "sns_arn" {
  value = aws_sns_topic.example_topic.arn
}
```


## Como subir um lambda por Terraform

Crie uma pasta no terraform chamada lambda e dentro da pasta crie um arquivo **lambda.tf** 

```
resource "aws_lambda_function" "example" {
  function_name = "events"
  runtime = "python3.8"
  handler = "events.lambda_handler"
  role = aws_iam_role.lambda.arn

  filename = "lambda/events.zip"

  environment {
    variables = {
      EXAMPLE_VARIABLE = "example_value"
    }
  }
}

resource "aws_iam_role" "lambda" {
  name = "a1s3-events-execution-lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda.name
}

output "function_name" {
  value = aws_lambda_function.example.function_name
}

output "function_arn" {
  value = aws_lambda_function.example.arn
}
```

## Como fazer CloudWatch por terraform

