FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["ReportAgent.API.csproj", "./"]
RUN dotnet restore "ReportAgent.API.csproj"
COPY . .
RUN dotnet build "ReportAgent.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ReportAgent.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create uploads directory
RUN mkdir -p /app/uploads

ENTRYPOINT ["dotnet", "ReportAgent.API.dll"]