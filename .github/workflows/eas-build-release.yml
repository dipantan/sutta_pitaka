name: Build and Release APK for Obtainium
on:
  push:
    branches: [main]
  workflow_dispatch: # Allows manual triggering from GitHub UI
jobs:
  build-and-release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Start EAS Build
        id: eas-build
        run: |
          BUILD_OUTPUT=$(eas build --platform android --profile production --non-interactive --json)
          BUILD_ID=$(echo "$BUILD_OUTPUT" | jq -r '.id')
          echo "build-id=$BUILD_ID" >> $GITHUB_OUTPUT
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Wait for EAS Build to Complete
        run: |
          STATUS="pending"
          while [ "$STATUS" = "pending" ] || [ "$STATUS" = "in-progress" ]; do
            sleep 30
            STATUS=$(eas build:status --platform android --build-id ${{ steps.eas-build.outputs.build-id }} --json | jq -r '.status')
            echo "Build status: $STATUS"
            if [ "$STATUS" = "finished" ]; then
              echo "Build completed successfully"
              break
            elif [ "$STATUS" = "errored" ]; then
              echo "Build failed"
              exit 1
            fi
          done
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Fetch Build Artifact URL
        id: fetch-artifact
        run: |
          ARTIFACT_URL=$(eas build:list --platform android --build-profile production --limit 1 --json | jq -r '.[0].artifacts.buildUrl')
          echo "artifact-url=$ARTIFACT_URL" >> $GITHUB_OUTPUT
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Download APK
        run: |
          curl -L -o app-release.apk "${{ steps.fetch-artifact.outputs.artifact-url }}"
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: app-release.apk
          tag_name: v${{ github.run_number }}
          name: Release v${{ github.run_number }}
          body: Automated APK release for Obtainium users
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
