import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { ConnectionsModule } from "../connections/connections.module";

export const setupSwagger = (app: INestApplication, path = "swagger/v1") => {
  const documentBuilderConfig = new DocumentBuilder()
    .setTitle("")
    .setDescription("")
    .setVersion("1.0")
    .addTag("Возвраты")
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(
    app,
    documentBuilderConfig,
    {
      include: [ConnectionsModule],
    }
  );
  SwaggerModule.setup(path, app, swaggerDocument);
};
