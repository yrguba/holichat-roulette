import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { CONNECTIONS_ROUTE_PREFIX } from "../constants/route";
import { ConnectionsService } from "./connections.service";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateConnectionDto } from "./dto/create-connection.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("Соединения")
@Controller(CONNECTIONS_ROUTE_PREFIX)
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  //@ApiBearerAuth()
  //@UseGuards(JwtAuthGuard)
  @Get("/list")
  async getEmployeeList(@Res() res, @Req() req, @Param() params) {
    const list = await this.connectionsService.getList();
    res.status(200).json({ data: list });
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post("/new")
  async createConnection(
    @Res() res,
    @Req() req,
    @Body() body: CreateConnectionDto,
    @Param() params
  ) {
    const connection = await this.connectionsService.createConnection(
      "test",
      body.uuid
    );
    res.status(200).json({ data: connection });
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @ApiParam({ name: "uuid", required: true })
  @Post("/:uuid/refresh")
  async updateEmployee(@Res() res, @Req() req, @Param() params) {
    const employee = await this.connectionsService.refreshConnection(
      params.uuid
    );

    res.status(200).json({ data: employee });
  }
}
