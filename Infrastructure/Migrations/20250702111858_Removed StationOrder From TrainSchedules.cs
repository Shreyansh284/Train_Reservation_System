using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovedStationOrderFromTrainSchedules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ArrivalTime",
                table: "TrainSchedules");

            migrationBuilder.DropColumn(
                name: "DayNumber",
                table: "TrainSchedules");

            migrationBuilder.DropColumn(
                name: "DepartureTime",
                table: "TrainSchedules");

            migrationBuilder.DropColumn(
                name: "StationOrder",
                table: "TrainSchedules");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "ArrivalTime",
                table: "TrainSchedules",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DayNumber",
                table: "TrainSchedules",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "DepartureTime",
                table: "TrainSchedules",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StationOrder",
                table: "TrainSchedules",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
